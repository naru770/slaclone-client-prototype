import React, {useState, useEffect} from 'react'
import axios from 'axios'

function App() {

  // APIサーバーのURL
  const origin = "http://localhost:5000"

  interface Thread {
    id: number,
    name: String
  }

  interface Comment {
    id: number,
    threadId: number,
    content: String
  }

  const [threads, setThreads] = useState<Thread[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newThreadName, setNewThreadName] = useState<String>("")
  const [newComment, setNewComment] = useState<String>("")
  const [selectedThread, setSelectedThread] = useState<number|undefined>(undefined)

  const loadComment = () => {
    axios.get(origin + "/comment/thread/" + selectedThread)
    .then((res) => {
      setComments(res.data.comments)
    })
  }

  const loadThread = () => {
    axios.get(origin + "/thread")
    .then((res) => {
      setThreads(res.data.threads)
    })
  }

  const changeThread = (id: number) => {
    setSelectedThread(id)
    axios.get(origin + "/comment/thread/" + id)
      .then((res) => {
        setComments(res.data.comments)
      })
  }

  const postThread = (name: String) => {
    axios.post(origin + "/thread", { name: name })
      .then(() => { loadThread() })
  }

  const deleteThread = () => {
    setComments([])
    axios.delete(origin + "/thread", { data: { id: selectedThread } })
      .then(() => { loadThread() })
  }

  const postComment = () => {
    axios.post(origin + "/comment", {
      thread_id: selectedThread,
      content: newComment
    })
    .then(() => { loadThread() })
  }


  useEffect(() => {
    axios.get(origin + "/thread")
    .then((res) => {
      setThreads(res.data.threads)
    })
  }, [])


  return (
    <div className="App">
        <div className="container m-3">
          <div className="row border border-3 rounded">

            <div id="thread-area" className="col-3 bg-secondary bg-opacity-25">
              <div id="thread-area-ui">
                <div id="thread-select" className="mt-3">
                  {threads.map((e) => (
                    <button type="button" key={e.id} className={"btn container-fluid mb-1 " + ((selectedThread === e.id) ? 'btn-secondary' : 'btn-outline-secondary')}
                      onClick={() => { changeThread(e.id) }}>
                      {e.name} (id:{e.id})
                    </button>
                  ))}
                </div>
                <div id="thread-form" className="mt-5">
                  <div className="mb-3">
                    <label htmlFor="threadNameInput" className="form-label">Thread Title</label>
                    <input type="text" className="form-control" id="threadNameInput" name="name" onChange={(e) => { setNewThreadName(e.target.value) }} />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary mb-3" onClick={() => { postThread(newThreadName) }}>Submit Thread</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="comment-area" className="col-9">
              <div id="comment-area-ui" className="mx-4">
                <div id="comment-list" className="mt-3">
                  {(comments.length === 0) ? <p>no comments found</p> : ""}
                  {comments.map((e, i) => (
                    <div key={e.id} className="border-bottom mt-2">
                      <div className="mx-3">
                        <p>{i + 1}: 名無し</p>
                        <p>{e.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div id="comment-form" className="my-3">
                  <div>
                    <label htmlFor="commentInput" className="form-label">Comment</label>
                    <textarea className="form-control" id="commentInput" name="name"
                      onChange={(e) => { setNewComment(e.target.value) }} />
                  </div>

                  <div className="btn-toolbar justify-content-between mt-3">
                    <div className="btn-group">
                      <button className="btn btn-primary"
                        onClick={() => { postComment() }}
                        disabled={(selectedThread === undefined)}>Submit Comment</button>
                    </div>
                    <div className="btn-group ml-auto">
                      <button className="btn btn-danger"
                        onClick={() => { deleteThread() }}
                        disabled={(selectedThread === undefined)}>Delete Thread</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>
  );
}

export default App;
