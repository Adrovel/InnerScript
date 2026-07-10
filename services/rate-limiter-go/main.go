package main

import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"time"
)

type CheckRequest struct {
	Capacity         float64 `json:"capacity"`
	RefillPerSecond float64 `json:"refill_per_second"`
	PreviousTokens   float64 `json:"previous_tokens"`
	PreviousRefillAt int64   `json:"previous_refill_at"`
	Cost             float64 `json:"cost"`
}

type CheckResponse struct {
	Allowed         bool    `json:"allowed"`
	TokensRemaining float64 `json:"tokens_remaining"`
	RetryAfterMs    int64   `json:"retry_after_ms"`
	RefillAt        int64   `json:"refill_at"`
}

func checkTokenBucket(now int64, req CheckRequest) CheckResponse {
	capacity := req.Capacity
	if capacity <= 0 {
		capacity = 10
	}
	refillPerSecond := req.RefillPerSecond
	if refillPerSecond <= 0 {
		refillPerSecond = 1
	}
	cost := req.Cost
	if cost <= 0 {
		cost = 1
	}

	elapsedSeconds := math.Max(0, float64(now-req.PreviousRefillAt)/1000)
	tokens := math.Min(capacity, req.PreviousTokens+elapsedSeconds*refillPerSecond)
	allowed := tokens >= cost
	retryAfter := int64(0)

	if !allowed {
		retryAfter = int64(math.Ceil(((cost - tokens) / refillPerSecond) * 1000))
	}

	if allowed {
		tokens -= cost
	}

	return CheckResponse{
		Allowed:         allowed,
		TokensRemaining: tokens,
		RetryAfterMs:    retryAfter,
		RefillAt:        now,
	}
}

func checkHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CheckRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	w.Header().Set("content-type", "application/json")
	_ = json.NewEncoder(w).Encode(checkTokenBucket(time.Now().UnixMilli(), req))
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("content-type", "application/json")
	_, _ = w.Write([]byte(`{"ok":true}`))
}

func main() {
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/check", checkHandler)

	log.Println("innerscript rate limiter listening on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
