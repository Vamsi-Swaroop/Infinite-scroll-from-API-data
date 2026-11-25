import { useEffect, useState,useRef } from 'react'

const App = () => {

  const LIMIT= 10 //No of items you want to fetch per round
  const[data,setData]=useState([]) //state var to store the data that is fetched
  const[skip,setSkip]=useState(0) // skip will vary based on the number of the cycle
  const observerRef = useRef(null) // to observe the reference div at the end

  useEffect(()=>{ //fetching logic stored in useEffect, everytime the skip is changed it runs
    const getPosts = async ()=>{
      try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${skip}&_limit=${LIMIT}`)
      const posts = await response.json()
      setData((prev)=>[...prev,...posts] )
      }
      catch{
        console.log(`error fetching`)
      }

    }

    getPosts()
  },[skip])

  useEffect(()=>{ //everytime we hit the bottom , skip triggers and hencce the data fetched every cycle
    const observer = new IntersectionObserver((entries)=>{ //observer to obsevrve the last div on the JSX
      if(entries[0].isIntersecting){
        setSkip((prev)=> prev+LIMIT) //In case the last element is reached then we change the skip value
      }
    })
    if(observerRef.current){
      observer.observe(observerRef.current)
    }
    return ()=> observer.disconnect()  //observer clean up
  },[])

  return (

    //jsx
    <>
      <div className='flex flex-col gap-2' >
        <div>
        { data.map((post)=> <div key={post.id} className='flex flex-col gap-2 border justify-center' >
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div> ) }
      </div>
      <div ref={observerRef} ></div> //last element
      </div>
    </>
  )
}

export default App