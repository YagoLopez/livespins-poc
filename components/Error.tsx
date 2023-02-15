export default function Error({ error }: { error: any }) {
  return (
    <div className="flex justify-center w-full h-full text-red-400 m-auto p-10 font-semibold">
      <p>There was an error: {error?.message}</p>
    </div>
  )
}
