import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "./Editor";

export default function Editpost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect,setRedirect] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetch('https://blog-mern-backend-zdm1.onrender.com/post'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, [id]);

  async function updatePost(ev) {
  ev.preventDefault();

  const data = new FormData();
  data.set('title', title);
  data.set('summary', summary);
  data.set('content', content);
  data.set('id', id);

  if (files?.[0]) {
    data.set('file', files[0]);
  }

  try {
    const response = await fetch('https://blog-mern-backend-zdm1.onrender.com/post1', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      const errMsg = await response.text();
      console.error('PUT failed:', errMsg);
    }
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}
