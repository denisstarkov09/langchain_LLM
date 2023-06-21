import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card } from "@/components/Card"
import {
  BackgroundColorBlur,
  BackgroundGridPattern,
  PageLayout,
} from "@/components/Layouts"
import { NamespaceSelector } from "@/components/NamespaceInput"
import { DocumentQA } from "@/components/query/DocumentQA"
import { FileUpload } from "@/components/train/FileUpload"
import { UrlScraper } from "@/components/train/UrlScraper"

function ToggleHeading({ text, embedding }) {
  const activeHeading = text == embedding
  return (
    <h1
      className={cn(
        " my-6 font-aboreto text-3xl transition duration-300 sm:text-6xl",
        activeHeading ? "text-mauve-12" : "text-mauve-8"
      )}
    >
      {text}
    </h1>
  )
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

export default function Pinecone() {
  const [namespace, setNamespace] = useState("")
  const [embedding, setEmbedding] = useState("CHATBOT")
  const [animateOnce, setAnimateOnce] = useState(true)
  const [apikey, setApikey] = useState('');
  const handleNamespaceSelect = useCallback((selectedNamespace) => {
    console.log("Selected namespace:", selectedNamespace)
    setNamespace(selectedNamespace)
  }, [])

  function toggleEmbedding() {
    setEmbedding(embedding === "UPLOAD" ? "CHATBOT" : "UPLOAD")
    setAnimateOnce(false)
  }

  const imageVariants = {
    rotate: {
      rotateY: 90,
    },
  }

  const setKey = (value) => {
    setApikey(value);
  }

  return (
    <PageLayout>
      <div className="   flex flex-col items-center  gap-3 px-3 pt-5">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-5 items-center md:max-w-2xl">
            <div className="w-full">
              <NamespaceSelector
                newNamespace={namespace}
                apikey={apikey}
                setApiKey={setKey}
                onNamespaceSelect={handleNamespaceSelect}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {embedding === "UPLOAD" ? (
              <motion.div
                key={"UPLOAD"}
                className="  flex w-full flex-col items-center"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
              >
                <div className="w-full flex flex-col items-center justify-between md:mt-6 md:flex-row md:items-start ">
                  <div className=" w-full pt-4 md:mx-4 md:mt-0 md:max-w-2xl">
                    <div className="  w-full">
                      <Card
                        cardDetails={{
                          name: "Upload",
                          description:
                            "",
                        }}
                      >
                        <FileUpload namespace={namespace} />
                      </Card>
                    </div>
                  </div>

                  <div className=" pt-4 md:mx-4 md:mt-0 md:max-w-2xl">
                    <div className=" w-full">
                      <Card
                        cardDetails={{
                          name: "Scrape",
                          description: "Scrape URLs to generate embeddings",
                        }}
                      >
                        <UrlScraper apikey={apikey} namespace={namespace} />
                      </Card>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className=" flex w-full flex-col items-center ">
                <p className="mb-3 mt-2 max-w-lg text-center text-neutral-800 dark:text-neutral-200 md:text-lg">
                  Please Chat!
                </p>

                <DocumentQA apikey={apikey} namespace={namespace} />
              </div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 -z-10 overflow-hidden ">
            <BackgroundGridPattern />
          </div>
          <BackgroundColorBlur />
        </div>
      </div>
    </PageLayout>
  )
}
