import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
function App() {
  const sampleStudentData = [
    {
      name: 'Alice',
      date: '16-09-2024',
      reg: '1235',
    },
    {
      name: 'Nadun',
      date: '16-09-2024',
      reg: '1236',
    },
    {
      name: 'Kamal',
      date: '16-09-2024',
      reg: '1237',
    },
    {
      name: 'Tharaka',
      date: '16-09-2024',
      reg: '1238',
    },
  ]
  return (
    <>
      {
        sampleStudentData.map(
          (std)=>{
            return(
              <div className="flex w-full justify-center">
                <div>{std.reg}</div>
                <div>{std.name}</div>
                <div>{std.date}</div>
                <button className=""><CiEdit /></button>
                <button><MdDelete /></button>
              </div>
            )
          }
        )
      }

    </>
  )
}

export default App
