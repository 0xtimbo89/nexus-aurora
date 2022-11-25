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
import { useTron } from "@components/TronProvider";
import { fetchAsset } from "@utils/web3";
import { abridgeAddress } from "@utils/abridgeAddress";
import Link from "next/link";

const ModelWithNoSSR = dynamic(() => import("@components/Model"), {
  ssr: false,
});

function Asset() {
  const router = useRouter();
  const { address, provider } = useTron();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id: collectionAddress, pid: tokenId } = router.query;
  const [listingPriceBN, setListingPriceBN] = useState<number>();
  const [listingPrice, setListingPrice] = useState<string>("");
  const [tokenURI, setTokenURI] = useState<string>("");
  const [metadata, setMetadata] = useState<any>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [trxPrice, setTrxPrice] = useState<number>(0.0511);
  const [seller, setSeller] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [collMetadata, setCollMetadata] = useState<any>();

  const fetchCollectionURI = useCallback(async () => {
    if (!collectionAddress) return;
    try {
      const nftContract = await provider.contract().at(collectionAddress);
      const collectionURI = await nftContract["getCollectionURI"]().call();

      const response = await fetch(collectionURI);
      const result = await response.json();

      setCollMetadata(result);
    } catch (e) {
      console.log(e);
    }
  }, [collectionAddress]);

  const fetchTRXPrice = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8888/utils/price/TRX");
      const { price } = await response.json();
      setTrxPrice(price);
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

  const fetchIsOwner = useCallback(async () => {
    if (!collectionAddress) return;
    try {
      const nftContract = await provider.contract().at(collectionAddress);

      const owner = await nftContract.ownerOf(tokenId).call();

      const hexOwner = provider.address.toHex(address);

      if (owner === hexOwner) {
        setIsOwner(true);
      }
    } catch (e) {
      console.log(e);
    }
  }, [collectionAddress]);

  const fetchListingSeller = useCallback(async () => {
    if (!collectionAddress) return;
    try {
      const nexusProtocol = await provider
        .contract()
        .at(process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS);

      const fetchedSeller = await nexusProtocol
        .getListingSeller(collectionAddress, tokenId)
        .call();

      setSeller(provider.address.fromHex(fetchedSeller));
    } catch (e) {
      console.log(e);
    }
  }, [collectionAddress]);

  const fetchListingPrice = useCallback(async () => {
    if (!collectionAddress) return;
    try {
      const nexusProtocol = await provider
        .contract()
        .at(process.env.NEXT_PUBLIC_NEXUS_CONTRACT_ADDRESS);

      const hasListingResult = await nexusProtocol
        .hasActiveListing(collectionAddress, tokenId)
        .call();

      const listingPriceNum = hasListingResult.toNumber() / 10 ** 6;

      if (listingPriceNum === 0) {
        setListingPrice("");
        return;
      }

      const listingPriceStr = listingPriceNum.toFixed(2);

      setListingPrice(listingPriceStr);
      setListingPriceBN(hasListingResult.toNumber());
    } catch (e) {
      console.log(e);
    }
  }, [collectionAddress]);

  const fetchTokenURI = useCallback(async () => {
    if (!collectionAddress) return;
    try {
      const nftContract = await provider.contract().at(collectionAddress);

      const uri = await nftContract["tokenURI"](tokenId).call();

      const response = await fetch(uri);

      const result = await response.json();

      setTokenURI(uri);
      setMetadata(result);
    } catch (e) {
      console.log(e);
    }
  }, [collectionAddress, tokenId]);

  useEffect(() => {
    if (!collMetadata) {
      fetchCollectionURI();
    }
    if (!trxPrice) {
      fetchTRXPrice();
    }
    if (!isOwner) {
      fetchIsOwner();
    }
    if (history.length === 0) {
      fetchAssetInfo();
    }
    if (!listingPrice) {
      fetchListingPrice();
    }
    if (!seller) {
      fetchListingSeller();
    }
    if (!metadata) {
      fetchTokenURI();
    }
  }, [fetchTRXPrice, fetchIsOwner, fetchListingPrice, fetchTokenURI]);

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
        subtitle: "TRON Shasta Testnet",
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
        title: "View collection on Tronscan",
        link: `https://shasta.tronscan.org/#/contract/${collectionAddress}/transactions`,
      },
    ];
  }, [metadata, tokenURI]);

  const listingPriceFiat = useMemo(
    () => (trxPrice * Number(listingPrice)).toFixed(2),
    [trxPrice, listingPrice]
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

  if (!tokenId || !metadata)
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
        listingPriceBN={listingPriceBN}
        listingPrice={listingPrice}
        trxPrice={trxPrice}
        metadata={metadata}
        seller={seller}
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
                              {price} TRX
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
              <Text className={styles.priceTag}>{listingPrice} TRX</Text>
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
