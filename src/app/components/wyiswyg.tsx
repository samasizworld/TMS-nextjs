import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const MyQuillEditor = ({ content, handleChange }: any) => {

  return (
    <ReactQuill
      value={content}
      onChange={handleChange}
      // className={'h-[400px]'}
      modules={{
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' },
          { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image', 'video'],
          ['clean']
        ],
      }}
      formats={[
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
      ]}
    />
  );
};

export default MyQuillEditor;
