import React, { useState } from "react"
// import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { getNamespaceKeys, usePineconeStats } from "@/hooks/use-pinecone-stats"
import axios from 'axios'

export function NamespaceSelector({ newNamespace, apikey, setApiKey, onNamespaceSelect }) {
  const [namespace, setNamespace] = useState(newNamespace)
  const [isbusy, setIsBusy] = React.useState(false);

  const { data, error } = usePineconeStats()

  const handleInputChange = (event) => {
    const inputValue = event.target.value
    setNamespace(inputValue)
    onNamespaceSelect(inputValue)
  }

  const getNameSpaceData = async () => {
    setIsBusy(true);
    try {
      const response = await axios.post('/api/get-namespacedata/', {memberID : namespace});
      const result = response.data;
      console.log("result : ", result);
      if(!result || result.message === 'Member does not exist') {
        setIsBusy(false);
        alert('Namespace does not exist')
        return ;
      }
      
      console.log("result pdf : ", result.pdfs[0]);
      const res = await axios.post('/api/train-pdf/', {apikey, namespace, filepath: result.pdfs[0]})
      if(!res.data) {alert('Operation failed')}
      if(res.data === namespace) alert("Operation success!")
      console.log("Pinecone Training",res.data);
      setIsBusy(false);
    } catch(e) {
      alert('Operation failed');
      setIsBusy(false);
      console.log(e);
    }
  }

  const previousNamespaces =
    !error && data && getNamespaceKeys(data.indexDescription)

  return (
    <div className="flex flex-col items-center gap-3 md:flex-row">
      { !isbusy ? "" :
        <div className="fixed left-0 top-0 h-screen w-screen z-50 text-center text-[40px] text-gray-100 backdrop-blur-sm">
          <p className="self-center">{"This won't take so much time..."}</p>
        </div>
      }
      <div className=" flex flex-col gap-1.5">
        <Label className=" mb-[1.75px]" htmlFor="apikey">
          OPENAI API KEY
        </Label>

        <Input
          value={apikey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-"
        />
      </div>
      <div className=" flex flex-col gap-1.5">
        <Label className=" mb-[1.75px]" htmlFor="namespace">
          Member ID
        </Label>

        <Input
          value={namespace}
          onChange={handleInputChange}
          placeholder="default"
        />
      </div>
        <Button className="mt-[20px]" onClick={() => getNameSpaceData()}>Chat</Button>

      {/* <div className="flex flex-col gap-1.5">
        <Label className=" mb-[1.75px]" htmlFor="namespace">
          Namespace
        </Label>

        <Select onValueChange={handleDropdownChange}>
          <SelectTrigger
            className={cn(
              " input-shadow h-13 w-[250px] rounded-lg !outline-none",
              "relative border border-black/5 bg-white px-7 py-3.5 text-base shadow-black/5  placeholder:text-neutral-400 ",
              " dark:bg-black/80 dark:text-white dark:shadow-black/10 dark:placeholder:text-neutral-300 dark:focus:bg-black"
            )}
          >
            <SelectValue placeholder="default" />
          </SelectTrigger>

          <SelectContent>
            {previousNamespaces &&
              previousNamespaces.map((namespace, i) => (
                <SelectItem key={`${namespace}-${i}`} value={namespace}>
                  {namespace}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div> */}
    </div>
  )
}
