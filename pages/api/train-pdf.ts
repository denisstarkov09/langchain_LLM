import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { DirectoryLoader } from 'langchain/document_loaders';
import { pinecone } from '@/lib/pinecone-client';
import { CustomPDFLoader } from '@/lib/customPDFLoader';

import { Configuration, OpenAIApi } from "openai"


const getNewPath = (filePath) => {
  let idx = filePath.indexOf('/');
  const indices = [];
  while (idx !== -1) {
    indices.push(idx);
    idx = filePath.indexOf('/', idx + 1);
  }
  const newPath = filePath.slice(0, indices[indices.length-1]);
  console.log(newPath);
  return newPath;
}

/* Name of directory to retrieve your files from */
export default async function run(req : any, res : any) {
  try {
    /*load raw docs from the all files in the directory */
    const { apikey, namespace, filepath } = req.body;

    console.log("Pinecone Study api -----------", apikey, namespace);
    if(!apikey || !namespace) return res.status(200).json();
    
    const filePath = 'pages/assets/' + filepath;
    
    const newPath = getNewPath(filePath);
    console.log(namespace, newPath);

    const directoryLoader = new DirectoryLoader(newPath, {
      '.pdf': (path) => new CustomPDFLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 256,
      chunkOverlap: 30,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('Creating vector store...');
    // const embeddings = new OpenAIEmbeddings({openAIApiKey: apikey});
    const embeddings = new OpenAIEmbeddings();
    embeddings.clientConfig.apiKey = apikey;
    console.log("================", embeddings);
    /*create and store the embeddings in the vectorStore*/
    const index = await pinecone.Index(process.env.PINECONE_INDEX_NAME); //change to your own index name
    // await index.delete1([], true, PINECONE_NAME_SPACE_CACHE);
    //embed the PDF documents
     const result = await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespace,
      textKey: 'text',
    });
    console.log('Ingestion complete : ', result.namespace);
    return res.status(200).json(result.namespace);

  } catch (error) {
    console.log('error', error);
    return res.status(200).json();
    // throw new Error('Failed to ingest your data');
  }
};

// (async () => {
//   await run();
//   console.log('ingestion complete');
//   return 1;
// })();
