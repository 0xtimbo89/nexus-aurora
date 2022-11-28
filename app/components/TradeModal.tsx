import {
  HStack,
  VStack,
  Text,
  Image,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import styles from "@styles/Asset.module.css";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import NexusProtocol from "@data/NexusProtocol.json";
import NexusNFT from "@data/NexusNFT.json";
import { addEvent, changeOwnership } from "@utils/web3";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { ethers, BigNumber } from "ethers";
import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tokenId: string;
  collectionAddress: string;
  isOwner: boolean;
  listingPrice: string;
  ethPrice: number;
  metadata: any;
  seller: string;
};

enum MODAL_STATE {
  CREATE_LISTING,
  FULFILL_LISTING,
  CANCEL_LISTING,
}

function TradeModal({
  isOpen,
  onClose,
  tokenId,
  collectionAddress,
  isOwner,
  listingPrice,
  ethPrice,
  metadata,
  seller,
}: ModalProps) {
  const { address } = useAccount();
  const [price, setPrice] = useState("0");
  const [isAddedEvent, setAddedEvent] = useState(false);
  const isListed = !!listingPrice;

  function handlePriceChange(e) {
    setPrice(e.target.value);
  }

  const { config: fulfillListingConfig } = usePrepareContractWrite({
    address:
      process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS ??
      "0xBf4833D115b92074168804589811eb5A36DaA67e",
    abi: NexusProtocol.abi,
    functionName: "fulfillListing",
    args: [
      (collectionAddress as string) ??
        "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
      parseInt(tokenId, 10),
    ],
    overrides: {
      value: listingPrice ? ethers.utils.parseEther(listingPrice) : 0,
    },
  });

  const {
    data: fulfillTxnHash,
    isLoading: isFulfillLoading,
    isSuccess: isFulfillSuccess,
    write: fulfillListingCall,
  } = useContractWrite(fulfillListingConfig);

  const { config: cancelListingConfig } = usePrepareContractWrite({
    address:
      process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS ??
      "0xBf4833D115b92074168804589811eb5A36DaA67e",
    abi: NexusProtocol.abi,
    functionName: "cancelListing",
    args: [
      (collectionAddress as string) ??
        "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
      parseInt(tokenId, 10),
    ],
  });

  const {
    data: cancelTxnHash,
    isLoading: isCancelLoading,
    isSuccess: isCancelSuccess,
    write: cancelListingCall,
  } = useContractWrite(cancelListingConfig);

  const { data: isApproved } = useContractRead({
    address:
      (collectionAddress as string) ??
      "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
    abi: NexusNFT.abi,
    functionName: "isApprovedForAll",
    args: [
      address,
      process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS ??
        "0xBf4833D115b92074168804589811eb5A36DaA67e",
    ],
  });

  const { config: setApprovalConfig } = usePrepareContractWrite({
    address:
      (collectionAddress as string) ??
      "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
    abi: NexusNFT.abi,
    functionName: "setApprovalForAll",
    args: [
      process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS ??
        "0xBf4833D115b92074168804589811eb5A36DaA67e",
      true,
    ],
  });

  const { isLoading: isApproveLoading, write: setApprovalForAll } =
    useContractWrite(setApprovalConfig);

  const { config: createListingConfig } = usePrepareContractWrite({
    address:
      process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS ??
      "0xBf4833D115b92074168804589811eb5A36DaA67e",
    abi: NexusProtocol.abi,
    functionName: "createListing",
    args: [
      (collectionAddress as string) ??
        "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
      parseInt(tokenId, 10),
      price ? ethers.utils.parseEther(price) : BigNumber.from(0),
    ],
  });

  const {
    data: createTxnHash,
    isLoading: isListingLoading,
    isSuccess: isListingSuccess,
    write: createListingCall,
  } = useContractWrite(createListingConfig);

  const createListing = useCallback(async () => {
    if (
      !collectionAddress ||
      !tokenId ||
      !createListingCall ||
      !setApprovalForAll
    )
      return;

    try {
      if (isApproved === false) {
        await setApprovalForAll();
      }

      await createListingCall();
    } catch (e) {
      console.log(e);
    }
  }, [
    collectionAddress,
    isApproved,
    address,
    price,
    tokenId,
    ethPrice,
    createListingCall,
    setApprovalForAll,
  ]);

  const createListingEvent = useCallback(async () => {
    await addEvent(
      collectionAddress,
      tokenId.toString(),
      "list",
      price,
      (ethPrice * Number(price)).toFixed(2),
      address
    );
    setAddedEvent(true);
  }, [collectionAddress, price, address]);

  const cancelListingEvent = useCallback(async () => {
    await addEvent(
      collectionAddress,
      tokenId.toString(),
      "cancel",
      listingPrice,
      (ethPrice * Number(listingPrice)).toFixed(2),
      address
    );

    setAddedEvent(true);
  }, [ethPrice, listingPrice, collectionAddress, price, address]);

  const fulfillListingEvent = useCallback(async () => {
    await changeOwnership(
      collectionAddress,
      tokenId.toString(),
      metadata,
      address,
      seller
    );

    await addEvent(
      collectionAddress,
      tokenId.toString(),
      "purchase",
      listingPrice,
      (ethPrice * Number(listingPrice)).toFixed(2),
      address
    );
    setAddedEvent(true);
  }, [collectionAddress, metadata, listingPrice, address, seller]);

  useEffect(() => {
    if (isListingSuccess && !isAddedEvent) {
      createListingEvent();
    }
    if (isCancelSuccess && !isAddedEvent) {
      cancelListingEvent();
    }
    if (isFulfillSuccess && !isAddedEvent) {
      fulfillListingEvent();
    }
  }, [isListingSuccess, isFulfillSuccess, isCancelSuccess]);

  const aurorascanLink = useMemo(() => {
    if (fulfillTxnHash)
      return `https://testnet.aurorascan.dev/tx/${fulfillTxnHash.hash}`;

    if (cancelTxnHash)
      return `https://testnet.aurorascan.dev/tx/${cancelTxnHash.hash}`;

    if (createTxnHash)
      return `https://testnet.aurorascan.dev/tx/${createTxnHash.hash}`;
  }, [fulfillTxnHash, cancelTxnHash, createTxnHash]);

  const listingPriceFiat = useMemo(
    () => (ethPrice * Number(listingPrice)).toFixed(2),
    [ethPrice, listingPrice]
  );

  const modalState = useMemo(() => {
    if (!isOwner) return MODAL_STATE.FULFILL_LISTING;
    if (isListed) return MODAL_STATE.CANCEL_LISTING;
    return MODAL_STATE.CREATE_LISTING;
  }, [isOwner, isListed]);

  const ctaFunction = useCallback(() => {
    if (!isOwner) return fulfillListingCall();
    if (isListed) return cancelListingCall();
    return createListing();
  }, [isOwner, isListed, createListing, cancelListingCall, fulfillListingCall]);

  const imageUrl = useMemo(() => {
    if (!metadata) return "/kirby.png";
    return metadata.image_url;
  }, [metadata]);

  const name = useMemo(() => {
    if (!metadata) return "Kirby";
    return metadata.name;
  }, [metadata]);

  const collection = useMemo(() => {
    if (!metadata) return "Nexus Protocol Collection 3";
    return metadata.collection;
  }, [metadata]);

  if (isFulfillSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay className={styles.modalOverlay} />
        <ModalContent className={styles.modalContent}>
          <ModalHeader className={styles.modalHeader}>
            Transaction Confirmation
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Text fontSize="20px">
                Your purchase was successfully confirmed!
              </Text>
              <Box h="1rem"></Box>
              <HStack className={styles.modalSubContainer}>
                <Image
                  alt="modal"
                  src={imageUrl}
                  className={styles.modalImage}
                ></Image>
                <HStack className={styles.modalSubTextContainer}>
                  <VStack alignItems="flex-start">
                    <Text className={styles.modalTitle}>{name}</Text>
                    <Text className={styles.modalSubtitle}>{collection}</Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text className={styles.modalTitle}>
                      {listingPrice} aETH
                    </Text>
                    <Text className={styles.modalSubtitle}>
                      ${listingPriceFiat} USD
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
              <Box h="1rem"></Box>
              <VStack>
                <HStack>
                  <Link href="/profile">
                    <Button className={styles.modalBtn}>
                      View your collection
                    </Button>
                  </Link>
                  <ChakraLink href={aurorascanLink} isExternal>
                    <Button className={styles.modalBtn2}>
                      View transaction
                    </Button>
                  </ChakraLink>
                </HStack>
                <Text fontSize="12px" pt="0.5rem">
                  It may take up to ~3 min for Aurorascan to index the
                  transaction.
                </Text>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (isListingSuccess || isCancelSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay className={styles.modalOverlay} />
        <ModalContent className={styles.modalContent}>
          <ModalHeader className={styles.modalHeader}>
            Transaction Confirmation
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Text fontSize="20px">
                {`Your listing was successfully ${
                  isCancelSuccess ? "cancelled." : "created!"
                }`}
              </Text>
              <Box h="1rem"></Box>
              <HStack className={styles.modalSubContainer}>
                <Image
                  alt="modal"
                  src={imageUrl}
                  className={styles.modalImage}
                ></Image>
                <HStack className={styles.modalSubTextContainer}>
                  <VStack alignItems="flex-start">
                    <Text className={styles.modalTitle}>{name}</Text>
                    <Text className={styles.modalSubtitle}>{collection}</Text>
                  </VStack>
                </HStack>
              </HStack>
              <Box h="1rem"></Box>
              <ChakraLink href={aurorascanLink} isExternal>
                <Button className={styles.modalBtn}>View transaction</Button>
              </ChakraLink>
              <Text fontSize="12px" pt="0.5rem">
                It may take up to ~3 min for Aurorascan to index the
                transaction.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay className={styles.modalOverlay} />
      <ModalContent className={styles.modalContent}>
        <ModalHeader className={styles.modalHeader}>
          {modalState === MODAL_STATE.FULFILL_LISTING
            ? "Purchase NFT"
            : modalState === MODAL_STATE.CANCEL_LISTING
            ? "Cancel Listing"
            : "Create Listing"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <HStack className={styles.modalSubContainer}>
              <Image
                alt="modal"
                src={imageUrl}
                className={styles.modalImage}
              ></Image>
              <HStack className={styles.modalSubTextContainer}>
                <VStack alignItems="flex-start">
                  <Text className={styles.modalTitle}>{name}</Text>
                  <Text className={styles.modalSubtitle}>{collection}</Text>
                </VStack>
                {modalState === MODAL_STATE.FULFILL_LISTING && (
                  <VStack alignItems="flex-end">
                    <Text className={styles.modalTitle}>
                      {listingPrice} aETH
                    </Text>
                    <Text className={styles.modalSubtitle}>
                      ${listingPriceFiat} USD
                    </Text>
                  </VStack>
                )}
              </HStack>
            </HStack>
            <Box h="1rem"></Box>
            {modalState === MODAL_STATE.CREATE_LISTING && (
              <HStack
                w="100%"
                justifyContent="space-between"
                p="0 1rem 2rem 1rem"
              >
                <VStack className={styles.inputContainer}>
                  <Text className={styles.modalTitle}>Price</Text>
                  <VStack className={styles.inputUnitContainer}>
                    <Input
                      type="number"
                      className={styles.modalInput}
                      onChange={handlePriceChange}
                      value={price}
                      placeholder="0"
                    ></Input>
                    <Text className={styles.inputUnit}>aETH</Text>
                  </VStack>
                </VStack>
                <VStack className={styles.inputContainer}>
                  <Text className={styles.modalTitle}>Duration</Text>
                  <VStack className={styles.inputUnitContainer}>
                    <Input
                      type="number"
                      className={styles.modalInput}
                      placeholder="30"
                    />
                    <Text className={styles.inputUnit}>days</Text>
                  </VStack>
                </VStack>
              </HStack>
            )}
            <Button className={styles.modalBtn} onClick={ctaFunction}>
              {isApproveLoading ||
              isListingLoading ||
              isCancelLoading ||
              isFulfillLoading ? (
                <Spinner color="black" />
              ) : modalState === MODAL_STATE.FULFILL_LISTING ? (
                "Purchase NFT"
              ) : modalState === MODAL_STATE.CANCEL_LISTING ? (
                "Cancel Listing"
              ) : (
                "Create listing"
              )}
            </Button>
            {!isApproved && (
              <Text fontSize="14px" pt="0.5rem" width="100%" textAlign="center">
                You may need to approve spending on this collection first.
              </Text>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default TradeModal;

// const fulfillListing = useCallback(async () => {
//   setLoading(true);
//   if (!collectionAddress || !tokenId) return;

//   try {
//     const nexusProtocol = await provider
//       .contract()
//       .at(process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS);

//     const fulfillResult = await nexusProtocol
//       .fulfillListing(collectionAddress, parseInt(tokenId, 10))
//       .send({
//         feeLimit: 100_000_000,
//         callValue: listingPriceBN,
//         shouldPollResponse: false,
//       });

//     await changeOwnership(
//       collectionAddress,
//       tokenId.toString(),
//       metadata,
//       address,
//       seller
//     );

//     await addEvent(
//       collectionAddress,
//       tokenId.toString(),
//       "purchase",
//       listingPrice,
//       (ethPrice * Number(listingPrice)).toFixed(2),
//       address
//     );

//     setTxnHash(fulfillResult);
//     setFulfillSuccess(true);
//     console.log("purchase successful: ", fulfillResult);
//   } catch (e) {
//     console.log(e);
//   }
//   setLoading(false);
// }, [seller, address, listingPriceBN, collectionAddress, tokenId, ethPrice]);

// const cancelListing = useCallback(async () => {
//   setLoading(true);
//   if (!collectionAddress || !tokenId) return;

//   try {
//     const nexusProtocol = await provider
//       .contract()
//       .at(process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS);

//     const cancelResult = await nexusProtocol
//       .cancelListing(collectionAddress, parseInt(tokenId, 10))
//       .send({
//         feeLimit: 100_000_000,
//         callValue: 0,
//         shouldPollResponse: false,
//       });

//     await addEvent(
//       collectionAddress,
//       tokenId.toString(),
//       "cancel",
//       listingPrice,
//       (ethPrice * Number(listingPrice)).toFixed(2),
//       address
//     );

//     setTxnHash(cancelResult);
//     setCancelSuccess(true);
//     console.log("cancel successful: ", cancelResult);
//   } catch (e) {
//     console.log(e);
//   }
//   setLoading(false);
// }, [address, collectionAddress, tokenId, ethPrice]);

// const createListing = useCallback(async () => {
//   setLoading(true);
//   if (!collectionAddress || !tokenId) return;

//   try {
//     const nftContract = await provider.contract().at(collectionAddress);

//     const isApproved = await nftContract
//       .isApprovedForAll(
//         address,
//         process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS
//       )
//       .call();

//     if (isApproved === false) {
//       const setApprovalResult = await nftContract
//         .setApprovalForAll(
//           process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS,
//           true
//         )
//         .send({
//           feeLimit: 100_000_000,
//           callValue: 0,
//           shouldPollResponse: false,
//         });
//     }

//     const nexusProtocol = await provider
//       .contract()
//       .at(process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS);

//     const listingResult = await nexusProtocol
//       .createListing(
//         collectionAddress,
//         parseInt(tokenId, 10),
//         Number(price) * 10 ** 6
//       )
//       .send({
//         feeLimit: 100_000_000,
//         callValue: 0,
//         shouldPollResponse: false,
//       });

//     await addEvent(
//       collectionAddress,
//       tokenId.toString(),
//       "list",
//       price,
//       (ethPrice * Number(price)).toFixed(2),
//       address
//     );

//     setTxnHash(listingResult);
//     setListingSuccess(true);
//     console.log("listing successful: ", listingResult);
//   } catch (e) {
//     console.log(e);
//   }
//   setLoading(false);
// }, [address, price, tokenId, ethPrice]);
