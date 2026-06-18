import Image from "next/image";

export default async function Home() {
  
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const users = await res .json();

  console.log(users);
  
  

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-bold text-center sm:text-left">
          Posts
        </h1>
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>
              <h2 className="text-2xl font-bold">{user.title}</h2>
              <p>{user.body}</p>
            </li>
          ))}
        </ul>




      </main>
    </div>
  );
}
