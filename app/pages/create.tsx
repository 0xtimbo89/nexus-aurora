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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Web3Storage } from "web3.storage";
import Link from "next/link";
import NexusNFT from "@data/NexusNFT.json";
import { Metadata } from "@utils/types";
import { createAsset } from "@utils/web3";
import { useAccount, useContractRead, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";

const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY;

const client = new Web3Storage({
  token: WEB3_STORAGE_TOKEN,
  endpoint: new URL("https://api.web3.storage"),
});

function Create() {
  const { address } = useAccount();
  const { data: signer, isError } = useSigner();
  const [uploadedModel, setUploadedModel] = useState<any>();
  const [uploadedImage, setUploadedImage] = useState<Blob>();
  const [jsonCID, setJsonCID] = useState<string>("");
  const [txnHash, setTxnHash] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [trait, setTrait] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  function handleModelUpload(e) {
    setUploadedModel(e.target.files[0]);
  }

  function handleImageUpload(e) {
    setUploadedImage(e.target.files[0]);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleTraitChange(e) {
    setTrait(e.target.value);
  }

  function handleValueChange(e) {
    setValue(e.target.value);
  }

  async function uploadModel() {
    if (!uploadedModel) return;

    const blob = new Blob([uploadedModel], { type: "application/glb" });
    const modelToUpload = [new File([blob], "model.glb")];
    const modelCID = await client.put(modelToUpload);
    const modelLink = `https://${modelCID}.ipfs.w3s.link/model.glb`;

    return modelLink;
  }

  async function uploadImage() {
    if (!uploadedImage) return;

    const blob = new Blob([uploadedImage], { type: "image/png" });
    const imageToUpload = [new File([blob], "file.png")];
    const imageCID = await client.put(imageToUpload);
    const imageLink = `https://${imageCID}.ipfs.w3s.link/file.png`;

    return imageLink;
  }

  async function uploadJSON() {
    const modelCID = await uploadModel();
    const imageCID = await uploadImage();

    const jsonObject: Metadata = {
      name: name,
      description: description,
      collection: "Nexus Protocol Collection 3",
      image_url:
        imageCID ??
        "https://bafybeie6rfxujzadhx5t3ofso6sckg33jknl5vhobmgby7uetpmbzaojvm.ipfs.w3s.link/preview.png",
      animation_url:
        modelCID ??
        "https://bafybeicegfiiccusrwdyn3yut5temunjejordfmktyedjkumafwmd3ixpa.ipfs.w3s.link/kirby.glb",
      model_url:
        modelCID ??
        "https://bafybeicegfiiccusrwdyn3yut5temunjejordfmktyedjkumafwmd3ixpa.ipfs.w3s.link/kirby.glb",
      attributes: [
        {
          trait_type: trait,
          value: value,
        },
      ],
    };

    const blob = new Blob([JSON.stringify(jsonObject)], {
      type: "application/json",
    });

    const files = [new File([blob], "metadata.json")];
    const jsonCID = await client.put(files);
    const jsonLink = `https://${jsonCID}.ipfs.w3s.link/metadata.json`;
    setJsonCID(jsonLink);

    return { jsonLink, jsonObject };
  }

  const NFT_ADDRESS = useMemo(
    () =>
      process.env.NEXT_PUBLIC_NEXUS_COLLECTION_ADDRESS ??
      "0x9D2a3158c9629a610e4885a23bcFD5B1ad8ca804",
    [process.env.NEXT_PUBLIC_NEXUS_COLLECTION_ADDRESS]
  );

  const { data: lastTokenId } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_NEXUS_COLLECTION_ADDRESS ??
      "0x9D2a3158c9629a610e4885a23bcFD5B1ad8ca804",
    abi: NexusNFT.abi,
    functionName: "getLastTokenId",
  });

  const handleMint = useCallback(
    async (cid: string) => {
      console.log("address:", address);
      console.log("NFT_ADDRESS:", NFT_ADDRESS);
      try {
        const contract = new ethers.Contract(NFT_ADDRESS, NexusNFT.abi, signer);

        const nftResult = await contract.mintWithTokenURI(address, cid);
        setTxnHash(nftResult.hash);
        return nftResult;
      } catch (e) {
        console.log(e);
      }
    },
    [NFT_ADDRESS, address, signer]
  );

  async function handleListAsset() {
    setLoading(true);
    const { jsonLink: uploadedJSON, jsonObject: metadata } = await uploadJSON();
    console.log("Metadata successfully uploaded to IPFS: ", uploadedJSON);
    const nftResult = await handleMint(uploadedJSON);

    if (nftResult) {
      await createAsset(
        NFT_ADDRESS,
        (parseInt(lastTokenId as string, 10) + 1).toString(),
        metadata,
        address
      );
    }

    setLoading(false);
  }

  const navigationLink = useMemo(
    () =>
      lastTokenId
        ? `/collection/${NFT_ADDRESS}/${
            parseInt(lastTokenId as string, 10) + 1
          }`
        : `/collection/${NFT_ADDRESS}`,
    [lastTokenId]
  );

  if (!address) {
    return (
      <VStack className={styles.main}>
        <VStack w="100%">
          <Text className={styles.title}>Oops! Wait a minute.</Text>
          <Text className={styles.inputHeader}>
            Please connect your wallet before you proceed.
          </Text>
        </VStack>
      </VStack>
    );
  }

  if (txnHash) {
    return (
      <VStack className={styles.main}>
        <VStack w="100%">
          <Text className={styles.title}>Transaction Confirmation</Text>
          <Text className={styles.inputHeader}>
            {"Congrats! You've successfully created the following asset:"}
          </Text>
          <Box h="1rem"></Box>
          <ImageContainer
            w="600px"
            image={uploadedImage ? URL.createObjectURL(uploadedImage) : ""}
          />
          <Box h="1rem"></Box>
          <Text className={styles.inputHeader}>{name}</Text>
          <Box h="1rem"></Box>
          <HStack>
            <Link href={navigationLink}>
              <Button className={styles.modalBtn} onClick={() => {}}>
                View asset
              </Button>
            </Link>
            <ChakraLink
              href={`https://testnet.aurorascan.dev/tx/${txnHash}`}
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
          <Input
            onChange={handleNameChange}
            className={styles.input}
            value={name}
          ></Input>
        </VStack>
        <VStack className={styles.inputContainer}>
          <Text className={styles.inputHeader}>Description*</Text>
          <Input
            onChange={handleDescriptionChange}
            className={styles.input}
            value={description}
          ></Input>
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
          </VStack>
        ) : (
          <Image
            alt="preview"
            src={uploadedImage ? URL.createObjectURL(uploadedImage) : ""}
            className={styles.previewContainer}
          ></Image>
        )}
        <VStack className={styles.inputContainer}>
          <HStack w="100%" justifyContent="space-between" alignItems="flex-end">
            <Text className={styles.inputHeader}>Properties</Text>
            {/* <AddIcon w={3} h={3} /> */}
          </HStack>
          <HStack w="100%" justifyContent="space-between">
            <VStack className={styles.inputSubcontainer}>
              <Text className={styles.inputSubheader}>Trait Name</Text>
              <Input
                onChange={handleTraitChange}
                className={styles.subinput}
                value={trait}
              ></Input>
            </VStack>
            <VStack className={styles.inputSubcontainer}>
              <Text className={styles.inputSubheader}>Value</Text>
              <Input
                onChange={handleValueChange}
                className={styles.subinput}
                value={value}
              ></Input>
            </VStack>
          </HStack>
          <Button className={styles.purchaseBtn} onClick={handleListAsset}>
            {isLoading ? <Spinner color="black" /> : "Create"}
          </Button>
          {isLoading && (
            <Text fontSize="14px" pt="0.5rem" width="100%" textAlign="center">
              It may take up to ~3 min for the metadata to upload to IPFS.
            </Text>
          )}
        </VStack>
      </VStack>
    </HStack>
  );
}

export default Create;
