import { AddIcon } from "@chakra-ui/icons";
import {
  HStack,
  VStack,
  Text,
  Image,
  Input,
  Button,
  Spinner,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import ImageContainer from "@components/ImageContainer";
import styles from "@styles/Create.module.css";
import { useState } from "react";
import NexusProtocol from "@data/NexusProtocol.json";
import { ethers } from "ethers";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import Link from "next/link";

function Create() {
  const [uploadedModel, setUploadedModel] = useState<any>();
  const [uploadedImage, setUploadedImage] = useState<any>();
  // const [isTxnSuccessful, setIsTxnSuccessful] = useState(false);

  function handleModelUpload(e) {
    setUploadedModel(e.target.files[0]);
    // setFiles((prev) => [...prev, URL.createObjectURL(e.target.files[0])]);
  }

  function handleImageUpload(e) {
    setUploadedImage(URL.createObjectURL(e.target.files[0]));
  }

  const { config } = usePrepareContractWrite({
    addressOrName: "0xcb0BEd07B5ebD8E8e7aeb893a5091110a5658C5b",
    contractInterface: NexusProtocol.abi,
    functionName: "purchaseAsset",
    args: ["0x3c38e8171B85dc03B8DBdDbE00df00D56029895C", 1],
    overrides: {
      value: ethers.utils.parseEther(".01"),
    },
  });

  const {
    data: txnData,
    isLoading,
    isSuccess,
    write: purchaseNFT,
  } = useContractWrite(config);

  if (isSuccess) {
    return (
      <VStack className={styles.main}>
        <VStack w="100%">
          <Text className={styles.title}>Transaction Confirmation</Text>
          <Text className={styles.inputHeader}>
            {"Congrats! You've successfully created the following asset:"}
          </Text>
          <Box h="1rem"></Box>
          <ImageContainer w="600px" image={"/kirby.png"} />
          <Box h="1rem"></Box>
          <Text className={styles.inputHeader}>Kirby</Text>
          <Box h="1rem"></Box>
          <HStack>
            <Link href="/collection/0x3c38e8171B85dc03B8DBdDbE00df00D56029895C/128">
              <Button className={styles.modalBtn} onClick={() => {}}>
                View asset
              </Button>
            </Link>
            <ChakraLink
              href={
                txnData
                  ? `https://testnet.coinex.net/tx/${txnData.hash}`
                  : "https://testnet.coinex.net/tx/0x765cd806c4a62fdfe56be820487a9537d1125bc3ee2cc7c23ee3958ebffcb460"
              }
              isExternal
            >
              <Button className={styles.modalBtn2} onClick={() => {}}>
                View transaction
              </Button>
            </ChakraLink>
          </HStack>
        </VStack>
      </VStack>
    );
  }

  return (
    <HStack className={styles.main}>
      <VStack w="100%" alignItems="flex-start">
        <Text className={styles.title}>Create new asset</Text>
        <VStack className={styles.fileUploadContainer}>
          <input
            type="file"
            name="images"
            id="images"
            required
            multiple
            onChange={handleModelUpload}
            className={styles.fileUploader}
          />
          {!uploadedModel ? (
            <VStack className={styles.fileUploaderText}>
              <Image
                alt="upload"
                src="/upload.png"
                className={styles.fileUploaderIcon}
              ></Image>
              <Text className={styles.uploaderTitle}>Upload model</Text>
              <Text className={styles.uploaderTitle2}>
                File types supported: gltf, glb, fbx, obj
              </Text>
              <Text className={styles.uploaderSubtitle}>Max size: 100MB</Text>
            </VStack>
          ) : (
            <VStack className={styles.fileUploaderText}>
              <Image
                alt="upload"
                src="/upload.png"
                className={styles.fileUploaderIcon}
              ></Image>
              <Text className={styles.uploaderTitle}>Replace model</Text>
              <Text className={styles.uploaderTitle2}>
                Uploaded: {uploadedModel.name}
              </Text>
              <Text className={styles.uploaderSubtitle}>Max size: 100MB</Text>
            </VStack>
          )}
        </VStack>
      </VStack>
      <VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Name*</Text>
          <Input onChange={() => {}} className={styles.input}></Input>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Description*</Text>
          <Input onChange={() => {}} className={styles.input}></Input>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>External link</Text>
          <Input onChange={() => {}} className={styles.input}></Input>
        </VStack>
        <VStack w="100%" alignItems="flex-start">
          <Text className={styles.inputHeader}>Preview Image</Text>
        </VStack>
        {!uploadedImage ? (
          <VStack className={styles.imageUploadContainer}>
            <input
              type="file"
              name="images"
              id="images"
              required
              multiple
              onChange={handleImageUpload}
              className={styles.imageUploader}
            />
            <VStack className={styles.imageUploaderText}>
              <Image
                alt="upload"
                src="/upload.png"
                className={styles.imageUploaderIcon}
              ></Image>
              <Text className={styles.uploaderTitle3}>Upload image</Text>
              <Text className={styles.uploaderTitle4}>
                File types supported: jpg, png, svg
              </Text>
              <Text className={styles.uploaderSubtitle}>Max size: 35MB</Text>
            </VStack>
            {/* // <VStack className={styles.imageUploaderText}>
            //   <Image
            //     alt="upload"
            //     src="/upload.png"
            //     className={styles.imageUploaderIcon}
            //   ></Image>
            //   <Text className={styles.uploaderTitle3}>Replace image</Text>
            //   <Text className={styles.uploaderTitle4}>
            //     Uploaded: {uploadedImage.name}
            //   </Text>
            //   <Text className={styles.uploaderSubtitle}>Max size: 35MB</Text>
          // </VStack> */}
          </VStack>
        ) : (
          <Image
            alt="preview"
            src={uploadedImage ?? ""}
            className={styles.previewContainer}
          ></Image>
        )}
        <VStack className={styles.inputContainer}>
          <HStack w="100%" justifyContent="space-between" alignItems="flex-end">
            <Text className={styles.inputHeader}>Properties</Text>
            <AddIcon w={3} h={3} />
          </HStack>
          <HStack w="100%" justifyContent="space-between">
            <VStack className={styles.inputSubcontainer}>
              <Text className={styles.inputSubheader}>Trait Name</Text>
              <Input onChange={() => {}} className={styles.subinput}></Input>
            </VStack>
            <VStack className={styles.inputSubcontainer}>
              <Text className={styles.inputSubheader}>Value</Text>
              <Input onChange={() => {}} className={styles.subinput}></Input>
            </VStack>
          </HStack>
          <Button
            className={styles.purchaseBtn}
            onClick={() => purchaseNFT?.()}
          >
            {isLoading ? <Spinner color="black" /> : "Create"}
          </Button>
        </VStack>
      </VStack>
    </HStack>
  );
}

export default Create;
