package main

import "testing"

func TestCheckTokenBucketAllowsWhenTokensRemain(t *testing.T) {
	result := checkTokenBucket(10_000, CheckRequest{
		Capacity:         10,
		RefillPerSecond: 1,
		PreviousTokens:   2,
		PreviousRefillAt: 9_000,
		Cost:             2,
	})

	if !result.Allowed {
		t.Fatal("expected request to be allowed")
	}

	if result.TokensRemaining != 1 {
		t.Fatalf("expected 1 token remaining, got %f", result.TokensRemaining)
	}
}

func TestCheckTokenBucketDeniesWhenEmpty(t *testing.T) {
	result := checkTokenBucket(10_000, CheckRequest{
		Capacity:         10,
		RefillPerSecond: 1,
		PreviousTokens:   0,
		PreviousRefillAt: 10_000,
		Cost:             1,
	})

	if result.Allowed {
		t.Fatal("expected request to be denied")
	}

	if result.RetryAfterMs != 1000 {
		t.Fatalf("expected 1000ms retry, got %d", result.RetryAfterMs)
	}
}
