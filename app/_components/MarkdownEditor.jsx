'use client'
import React from "react"
import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'


export default function MarkdownEditor({value, onChange}) {
  const editorRef = useRef(null)
  const viewRef = useRef(null)
// Didn't understand this code. 
  useEffect(() =>{
    if (!editorRef.current || viewRef.current) return

    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const doc = update.state.doc.toString()
            onChange(doc)
          }
        }),
      ],
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])


  useEffect(() => {
    if (!viewRef.current) return
    const current = viewRef.current.state.doc.toString()
    if (current !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: current.length,
          insert: value,
        },
      })
    }
  }, [value])
  // Till here

  return (
    <div ref={editorRef} className="h-full border rounded-md" />
  );
}