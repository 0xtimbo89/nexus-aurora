import {
  HStack,
  VStack,
  Text,
  Image,
  SimpleGrid,
  Button,
  Box,
  useDisclosure,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import styles from "@styles/Asset.module.css";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import TradeModal from "@components/TradeModal";
import NexusProtocol from "@data/NexusProtocol.json";
import NexusNFT from "@data/NexusNFT.json";
import { fetchAsset, fetchPrice } from "@utils/web3";
import { abridgeAddress } from "@utils/abridgeAddress";
import Link from "next/link";
import { useAccount, useContractRead } from "wagmi";
import { BigNumber, ethers } from "ethers";

const ModelWithNoSSR = dynamic(() => import("@components/Model"), {
  ssr: false,
});

function Asset() {
  const router = useRouter();
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id: collectionAddress, pid: tokenId } = router.query;
  const [metadata, setMetadata] = useState<any>();
  const [ethPrice, setEthPrice] = useState<number>(1220);
  const [history, setHistory] = useState<any[]>([]);
  const [collMetadata, setCollMetadata] = useState<any>();

  const { data: URI } = useContractRead({
    address:
      (collectionAddress as string) ??
      "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
    abi: NexusNFT.abi,
    functionName: "getCollectionURI",
  });

  const fetchCollection = useCallback(async () => {
    if (!URI) return;
    const response = await fetch(URI as string);
    const result = await response.json();

    setCollMetadata(result);
  }, [URI]);

  const { data: owner } = useContractRead({
    address:
      (collectionAddress as string) ??
      "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
    abi: NexusNFT.abi,
    functionName: "ownerOf",
    args: [tokenId ?? "1"],
  });

  const { data: seller } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS ??
      "0xBf4833D115b92074168804589811eb5A36DaA67e",
    abi: NexusProtocol.abi,
    functionName: "getListingSeller",
    args: [
      (collectionAddress as string) ??
        "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
      tokenId ?? "1",
    ],
  });

  const {
    isError: hasNoListing,
    error: hasNoListingError,
    data: listingBN,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS ??
      "0xBf4833D115b92074168804589811eb5A36DaA67e",
    abi: NexusProtocol.abi,
    functionName: "hasActiveListing",
    args: [
      (collectionAddress as string) ??
        "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
      tokenId ?? "1",
    ],
  });

  const { data: tokenURI } = useContractRead({
    address:
      (collectionAddress as string) ??
      "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
    abi: NexusNFT.abi,
    functionName: "tokenURI",
    args: [tokenId ?? "1"],
  });

  const fetchToken = useCallback(async () => {
    if (!tokenURI) return;
    const response = await fetch(tokenURI as string);
    const result = await response.json();

    setMetadata(result);
  }, [tokenURI]);

  const fetchethPrice = useCallback(async () => {
    try {
      const response = await fetchPrice();
      const { price } = await response.json();
      setEthPrice(price);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const fetchAssetInfo = useCallback(async () => {
    if (!collectionAddress || !tokenId) return;

    const asset = await fetchAsset(
      collectionAddress as string,
      tokenId as string
    );

    if (!asset || !asset.history) {
      setHistory([]);
      return;
    }

    const sortedHistory = Object.values(asset.history).reverse();

    if (asset) {
      setHistory(sortedHistory);
    }
  }, [collectionAddress, tokenId]);

  useEffect(() => {
    if (!collMetadata) {
      fetchCollection();
    }
    if (!ethPrice) {
      fetchethPrice();
    }
    if (history.length === 0) {
      fetchAssetInfo();
    }
    if (!metadata) {
      fetchToken();
    }
  }, [fetchethPrice, fetchCollection, fetchToken, fetchAssetInfo]);

  const assetDetails = useMemo(() => {
    if (!collectionAddress || !metadata || !tokenURI) return [];
    return [
      {
        title: "Contract address",
        subtitle: collectionAddress,
      },
      {
        title: "Token ID",
        subtitle: tokenId,
      },
      {
        title: "Blockchain",
        subtitle: "Aurora Testnet",
      },
      {
        title: "Model",
        link: metadata.model_url,
      },
      {
        title: "IPFS Metadata",
        link: tokenURI,
      },
      {
        title: "View collection on Aurorascan",
        link: `https://testnet.aurorascan.dev/token/${collectionAddress}`,
      },
    ];
  }, [metadata, tokenURI]);

  const isOwner = useMemo(() => {
    return (
      owner && address && String(owner).toLowerCase() === address.toLowerCase()
    );
  }, [owner]);

  const listingPrice = useMemo(() => {
    if (hasNoListing || !listingBN || (listingBN as BigNumber).isZero())
      return "";
    return ethers.utils.formatEther(listingBN as BigNumber);
  }, [hasNoListing, listingBN]);

  const listingPriceFiat = useMemo(
    () => (ethPrice * Number(listingPrice)).toFixed(2),
    [ethPrice, listingPrice]
  );

  const modelUrl = useMemo(() => {
    if (!metadata) return "/kirby.png";
    return metadata.model_url;
  }, [metadata]);

  const imageUrl = useMemo(() => {
    if (!metadata) return "/kirby.png";
    return metadata.image_url;
  }, [metadata]);

  const name = useMemo(() => {
    if (!metadata) return "Kirby";
    return metadata.name;
  }, [metadata]);

  const description = useMemo(() => {
    if (!metadata) return "No description provided";
    return metadata.description;
  }, [metadata]);

  const collection = useMemo(() => {
    if (!metadata) return "Nexus Protocol Collection 3";
    return metadata.collection;
  }, [metadata]);

  const attributes = useMemo(() => {
    if (!metadata) return "Nexus Protocol Collection 3";
    return metadata.attributes;
  }, [metadata]);

  if (!tokenId || !metadata || !collMetadata)
    return (
      <VStack className={styles.main}>
        <Spinner />
      </VStack>
    );

  return (
    <VStack className={styles.main}>
      <TradeModal
        isOpen={isOpen}
        onClose={onClose}
        tokenId={tokenId as string}
        collectionAddress={collectionAddress as string}
        isOwner={isOwner}
        listingPrice={listingPrice}
        ethPrice={ethPrice}
        metadata={metadata}
        seller={seller as string}
      />
      <VStack
        w="1000px"
        h="500px"
        borderRadius="20px"
        overflow="hidden"
        background={`url("/bg.jpg") no-repeat center center fixed`}
      >
        <ModelWithNoSSR modelSrc={modelUrl} imageSrc={imageUrl} />
        <Suspense fallback={null}></Suspense>
      </VStack>
      <HStack alignItems="flex-start" gap="1rem" pt="1rem">
        <VStack alignItems="flex-start">
          <Text className={styles.title}>{name}</Text>
          <Text className={styles.subtitle}>{description}</Text>
          <Link href={`/collection/${collectionAddress}`}>
            <VStack className={styles.minterContainer} cursor="pointer">
              <Text className={styles.minterTitle} m={0}>
                Collection
              </Text>
              <HStack>
                <Image
                  alt="user"
                  src={collMetadata.image}
                  className={styles.minterImage}
                ></Image>
                <Text className={styles.minter}>{collection}</Text>
              </HStack>
            </VStack>
          </Link>
          <VStack gap="1rem">
            <VStack className={styles.sectionContainer}>
              <VStack className={styles.sectionTitleContainer}>
                <Text className={styles.sectionTitle}>History</Text>
              </VStack>
              {history.length > 0 ? (
                <VStack w="100%" maxH="200px" overflowY="scroll">
                  {history.map(
                    ({ title, subtitle, address, price, fiatPrice }) => (
                      <HStack w="100%" key={subtitle} pb="1rem">
                        <HStack w="100%">
                          <Image
                            alt="user"
                            src="/user.png"
                            className={styles.historyImage}
                          ></Image>
                          <VStack className={styles.historyRightSection}>
                            <Text m={0}>
                              <Text as="span" className={styles.historyTitle}>
                                {abridgeAddress(address)}
                              </Text>{" "}
                              {title}
                            </Text>
                            <Text className={styles.historySubtitle}>
                              {subtitle}
                            </Text>
                          </VStack>
                        </HStack>
                        <VStack className={styles.historyLeftSection}>
                          {price && (
                            <Text className={styles.historyTitle}>
                              {price} aETH
                            </Text>
                          )}
                          {fiatPrice && (
                            <Text className={styles.historySubtitle}>
                              ${fiatPrice} USD
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    )
                  )}
                </VStack>
              ) : (
                <Text className={styles.historySubtitle}>
                  No history available
                </Text>
              )}
            </VStack>
            <VStack className={styles.sectionContainer}>
              <VStack className={styles.sectionTitleContainer}>
                <Text className={styles.sectionTitle}>Properties</Text>
              </VStack>
              <SimpleGrid columns={3} gap="1rem">
                {attributes.map(({ trait_type, value }, idx) => (
                  <VStack className={styles.propertyCell} key={idx}>
                    <Text className={styles.propertyTitle}>{trait_type}</Text>
                    <Text className={styles.propertySubtitle}>{value}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </VStack>
            <VStack className={styles.sectionContainer}>
              <VStack className={styles.sectionTitleContainer}>
                <Text className={styles.sectionTitle}>Details</Text>
              </VStack>
              {assetDetails.map(({ title, subtitle, link }) => (
                <HStack key={title} className={styles.detailTextContainer}>
                  <Text className={styles.detailTitle}>{title}</Text>
                  {subtitle && (
                    <Text className={styles.detailSubtitle}>{subtitle}</Text>
                  )}
                  {link && (
                    <ChakraLink href={link} isExternal>
                      <ExternalLinkIcon />
                    </ChakraLink>
                  )}
                </HStack>
              ))}
            </VStack>
          </VStack>
        </VStack>
        <Box pt="1rem">
          {!listingPrice ? (
            <VStack className={styles.priceContainer}>
              <Text className={styles.priceTitle}>Asset not for sale</Text>
              {isOwner && (
                <VStack w="100%">
                  <Box h="0.2rem"></Box>
                  <Button className={styles.purchaseBtn} onClick={onOpen}>
                    Create listing
                  </Button>
                </VStack>
              )}
            </VStack>
          ) : (
            <VStack className={styles.priceContainer}>
              <Text className={styles.priceTitle}>Price</Text>
              <Text className={styles.priceTag}>{listingPrice} aETH</Text>
              <Text className={styles.priceUSD}>${listingPriceFiat} USD</Text>
              <Button className={styles.purchaseBtn} onClick={onOpen}>
                {isOwner ? "Cancel listing" : "Purchase"}
              </Button>
            </VStack>
          )}
        </Box>
      </HStack>
    </VStack>
  );
}

export default Asset;
