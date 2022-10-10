import {
  HStack,
  VStack,
  Text,
  Image,
  SimpleGrid,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import ImageContainer from "@components/ImageContainer";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import styles from "@styles/Asset.module.css";
import { Canvas } from "@react-three/fiber";
import { lazy, Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei";

const Model = lazy(() => import("@components/Scene"));

const details = [
  {
    title: "Contract address",
    subtitle: "0x7d3bc6b5de22a9bf0fd0c86954f42021736d4532",
  },
  {
    title: "Token ID",
    subtitle: 291,
  },
  {
    title: "Blockchain",
    subtitle: "KLAYTN",
  },
  {
    title: "Model",
    subtitle: "",
    link: "/",
  },
  {
    title: "IPFS Metadata",
    subtitle: "",
    link: "/",
  },
  {
    title: "View on KlaytnFinder",
    subtitle: "",
    link: "https://www.klaytnfinder.io/account/0x7d3bc6b5de22a9bf0fd0c86954f42021736d4532",
  },
];

const asset = {
  name: "SF Light - Fighter 291",
  description:
    "A space fighter is a small spacecraft designed for combat in space. They are typically equipped with weapons such as lasers and missiles, and are used to protect larger spacecraft or to attack enemy targets. Space fighters are agile and maneuverable, and can operate in both atmosphere and vacuum.",
  collection: "Space Fighter Collection",
  price: 193.23,
  fiat: 27.05,
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isSell?: boolean;
};

function TradeModal({ isOpen, onClose, isSell }: ModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTxnSuccessful, setIsTxnSuccessful] = useState(true);

  function handlePurchaseNFT() {
    setIsLoading(true);
  }

  if (isTxnSuccessful && !isSell) {
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
                  src="/20.png"
                  className={styles.modalImage}
                ></Image>
                <HStack className={styles.modalSubTextContainer}>
                  <VStack alignItems="flex-start">
                    <Text className={styles.modalTitle}>{asset.name}</Text>
                    <Text className={styles.modalSubtitle}>
                      {asset.collection}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text className={styles.modalTitle}>
                      {asset.price} KLAY
                    </Text>
                    <Text className={styles.modalSubtitle}>
                      ${asset.fiat} USD
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
              <Box h="1rem"></Box>
              <HStack>
                <Button className={styles.modalBtn} onClick={handlePurchaseNFT}>
                  View your collection
                </Button>
                <Button
                  className={styles.modalBtn2}
                  onClick={handlePurchaseNFT}
                >
                  View transaction
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (isTxnSuccessful && isSell) {
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
                Your listing was successfully created!
              </Text>
              <Box h="1rem"></Box>
              <HStack className={styles.modalSubContainer}>
                <Image
                  alt="modal"
                  src="/20.png"
                  className={styles.modalImage}
                ></Image>
                <HStack className={styles.modalSubTextContainer}>
                  <VStack alignItems="flex-start">
                    <Text className={styles.modalTitle}>{asset.name}</Text>
                    <Text className={styles.modalSubtitle}>
                      {asset.collection}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text className={styles.modalTitle}>
                      {asset.price} KLAY
                    </Text>
                    <Text className={styles.modalSubtitle}>
                      ${asset.fiat} USD
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
              <Box h="1rem"></Box>
              <HStack>
                <Button className={styles.modalBtn} onClick={handlePurchaseNFT}>
                  View transaction
                </Button>
              </HStack>
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
          {isSell ? "Sell NFT" : "Purchase NFT"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <HStack className={styles.modalSubContainer}>
              <Image
                alt="modal"
                src="/20.png"
                className={styles.modalImage}
              ></Image>
              <HStack className={styles.modalSubTextContainer}>
                <VStack alignItems="flex-start">
                  <Text className={styles.modalTitle}>{asset.name}</Text>
                  <Text className={styles.modalSubtitle}>
                    {asset.collection}
                  </Text>
                </VStack>
                {!isSell && (
                  <VStack alignItems="flex-end">
                    <Text className={styles.modalTitle}>
                      {asset.price} KLAY
                    </Text>
                    <Text className={styles.modalSubtitle}>
                      ${asset.fiat} USD
                    </Text>
                  </VStack>
                )}
              </HStack>
            </HStack>
            <Box h="1rem"></Box>
            {isSell && (
              <HStack
                w="100%"
                justifyContent="space-between"
                p="0 1rem 2rem 1rem"
              >
                <VStack className={styles.inputContainer}>
                  <Text className={styles.modalTitle}>Price</Text>
                  <VStack className={styles.inputUnitContainer}>
                    <Input type="number" className={styles.modalInput}></Input>
                    <Text className={styles.inputUnit}>KLAY</Text>
                  </VStack>
                </VStack>
                <VStack className={styles.inputContainer}>
                  <Text className={styles.modalTitle}>Duration</Text>
                  <VStack className={styles.inputUnitContainer}>
                    <Input type="number" className={styles.modalInput}></Input>
                    <Text className={styles.inputUnit}>days</Text>
                  </VStack>
                </VStack>
              </HStack>
            )}
            <Button className={styles.modalBtn} onClick={handlePurchaseNFT}>
              {isLoading ? (
                <Spinner color="black" />
              ) : isSell ? (
                "Create listing"
              ) : (
                "Purchase NFT"
              )}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function Asset() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isOwner = true;

  return (
    <VStack className={styles.main}>
      <TradeModal isOpen={isOpen} onClose={onClose} isSell={isOwner} />
      <VStack
        w="1000px"
        h="500px"
        borderRadius="20px"
        overflow="hidden"
        background={`url("/bg.jpg") no-repeat center center fixed`}
      >
        <Suspense fallback={null}>
          <Canvas
            camera={{
              position: [-50, 100, 50],
              rotation: [50, 50, 0],
              far: 500,
            }}
          >
            <pointLight position={[50, 70, 50]} intensity={10} />
            <pointLight position={[-50, 70, 50]} intensity={10} />
            <rectAreaLight
              width={3}
              height={3}
              color={"#fff"}
              intensity={54}
              position={[-2, 0, 5]}
              lookAt={[0, 0, 0]}
              penumbra={1}
              castShadow
            />

            <Model />
            <OrbitControls />
          </Canvas>
        </Suspense>
      </VStack>
      <HStack alignItems="flex-start" gap="1rem" pt="1rem">
        <VStack alignItems="flex-start">
          <Text className={styles.title}>{asset.name}</Text>
          <Text className={styles.subtitle}>{asset.description}</Text>
          <VStack className={styles.minterContainer}>
            <Text className={styles.minterTitle} m={0}>
              Collection
            </Text>
            <HStack>
              <Image
                alt="user"
                src="/fighter.png"
                className={styles.minterImage}
              ></Image>
              <Text className={styles.minter}>{asset.collection}</Text>
            </HStack>
          </VStack>
          <VStack gap="1rem">
            <VStack className={styles.sectionContainer}>
              <VStack className={styles.sectionTitleContainer}>
                <Text className={styles.sectionTitle}>History</Text>
              </VStack>
              {[0, 1, 2].map((num) => (
                <HStack w="100%" key={num} pb="1rem">
                  <HStack w="100%">
                    <Image
                      alt="user"
                      src="/user.png"
                      className={styles.historyImage}
                    ></Image>
                    <VStack className={styles.historyRightSection}>
                      <Text m={0}>
                        <Text as="span" className={styles.historyTitle}>
                          0xfa87...a497
                        </Text>{" "}
                        set a new asking price
                      </Text>
                      <Text className={styles.historySubtitle}>
                        Saturday, September 17, 2022 at 08:47:25
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack className={styles.historyLeftSection}>
                    <Text className={styles.historyTitle}>1.24 ETH</Text>
                    <Text className={styles.historySubtitle}>
                      $1,634.83 USD
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
            <VStack className={styles.sectionContainer}>
              <VStack className={styles.sectionTitleContainer}>
                <Text className={styles.sectionTitle}>Properties</Text>
              </VStack>
              <SimpleGrid columns={3} gap="1rem">
                {Array.apply(null, Array(6)).map((num, idx) => (
                  <VStack className={styles.propertyCell} key={idx}>
                    <Text className={styles.propertyTitle}>Background</Text>
                    <Text className={styles.propertySubtitle}>Light Blue</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </VStack>
            <VStack className={styles.sectionContainer}>
              <VStack className={styles.sectionTitleContainer}>
                <Text className={styles.sectionTitle}>Details</Text>
              </VStack>
              {details.map(({ title, subtitle, link }) => (
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
          <VStack className={styles.priceContainer}>
            <Text className={styles.priceTitle}>
              {isOwner ? "Asset not for sale" : "Price"}
            </Text>
            {isOwner && <Box h=".5rem"></Box>}
            {!isOwner && (
              <Text className={styles.priceTag}>{asset.price} KLAY</Text>
            )}
            {!isOwner && (
              <Text className={styles.priceUSD}>${asset.fiat} USD</Text>
            )}
            <Button className={styles.purchaseBtn} onClick={onOpen}>
              {isOwner ? "Create listing" : "Purchase"}
            </Button>
          </VStack>
        </Box>
      </HStack>
    </VStack>
  );
}

export default Asset;
