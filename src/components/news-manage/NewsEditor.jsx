import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const NewsEditor = (props) => {
  const [editorState, setEditorState] = useState();
  const { handleMessage } = props;
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editor) => setEditorState(editor)}
        onBlur={(event) => {
          handleMessage(event.target.innerText);
        }}
      />
    </div>
  );
};

export default NewsEditor;
