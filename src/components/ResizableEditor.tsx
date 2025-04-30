import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import * as monaco from 'monaco-editor';

export default function ResizableEditor({code, fontSize, changeCode}: any){

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editorRef.current?.layout();
  }

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (editorRef.current) {
        requestAnimationFrame(() => {
          editorRef.current?.layout();
        });
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return(
    <div ref={containerRef} style={{height: "100%"}}>
       {mounted && (
        <Editor
          height="300px"
          className="problem-ide-editor"
          defaultLanguage="python"
          value={code}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            automaticLayout: false
          }}
          onChange={changeCode}
          onMount={handleEditorDidMount}
        />
       )}
    </div>
  );
}
