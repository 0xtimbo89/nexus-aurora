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
import { ExternalLinkIcon } from "@chakra-ui/icons";
import styles from "@styles/Asset.module.css";
import { Canvas } from "@react-three/fiber";
import { lazy, Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import NexusProtocol from "@data/NexusProtocol.json";
import { ethers } from "ethers";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/router";

const Kirby = lazy(() => import("@components/Kirby.js"));
const Model = lazy(() => import("@components/Scene.js"));

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
    subtitle: "CSC",
  },
  {
    title: "Model",
    subtitle: "",
    link: "/",
  },
  {
    title: "IPFS Metadata",
    subtitle: "",
    link: "https://bafybeicaahj22pzqr5dqcxzwwlrps3oxpcyms34g6ddvocqsvfhphgiwwq.ipfs.w3s.link/3.json",
  },
  {
    title: "View on CSC Explorer",
    subtitle: "",
    link: "https://testnet.coinex.net/address/0x42eAcf5b37540920914589a6B1b5e45d82D0C1ca",
  },
];

const kirby = {
  name: "Kirby",
  description:
    "Kirby is a small, pink, spherical creature who has the ability to inhale objects and creatures to gain their powers. He is often called upon to save his home world of Dream Land from various villains.",
  collection: "Nexus Protocol Collection 3",
  price: 193.23,
  fiat: 7.73,
};

const asset = {
  name: "SF Light - Fighter 291",
  description:
    "A space fighter is a small spacecraft designed for combat in space. They are typically equipped with weapons such as lasers and missiles, and are used to protect larger spacecraft or to attack enemy targets. Space fighters are agile and maneuverable, and can operate in both atmosphere and vacuum.",
  collection: "Space Fighter Collection",
  price: 193.23,
  fiat: 7.73,
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isSell?: boolean;
  pid: string;
};

function TradeModal({ isOpen, onClose, isSell, pid }: ModalProps) {
  const { config } = usePrepareContractWrite({
    addressOrName: "0xcb0BEd07B5ebD8E8e7aeb893a5091110a5658C5b",
    contractInterface: NexusProtocol.abi,
    functionName: "purchaseAsset",
    args: ["0x3c38e8171B85dc03B8DBdDbE00df00D56029895C", 1],
    overrides: {
      value: ethers.utils.parseEther("10"),
    },
  });

  const {
    data: txnData,
    isLoading,
    isSuccess,
    write: purchaseNFT,
  } = useContractWrite(config);

  if (isSuccess && !isSell) {
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
                    <Text className={styles.modalTitle}>{asset.price} CET</Text>
                    <Text className={styles.modalSubtitle}>
                      ${(asset.price * 0.04).toFixed(2)} USD
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
              <Box h="1rem"></Box>
              <HStack>
                <Link href="/profile">
                  <Button className={styles.modalBtn}>
                    View your collection
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
                  <Button className={styles.modalBtn2}>View transaction</Button>
                </ChakraLink>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (true) {
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
              {pid != "128" ? (
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
                        <Text className={styles.modalTitle}>10 CET</Text>
                        <Text className={styles.modalSubtitle}>$0.4 USD</Text>
                      </VStack>
                    )}
                  </HStack>
                </HStack>
              ) : (
                <HStack className={styles.modalSubContainer}>
                  <Image
                    alt="modal"
                    src="/kirby.png"
                    className={styles.modalImage}
                  ></Image>
                  <HStack className={styles.modalSubTextContainer}>
                    <VStack alignItems="flex-start">
                      <Text className={styles.modalTitle}>{kirby.name}</Text>
                      <Text className={styles.modalSubtitle}>
                        {kirby.collection}
                      </Text>
                    </VStack>
                    <VStack alignItems="flex-end">
                      <Text className={styles.modalTitle}>10 CET</Text>
                      <Text className={styles.modalSubtitle}>$0.4 USD</Text>
                    </VStack>
                  </HStack>
                </HStack>
              )}
              <Box h="1rem"></Box>
              <HStack>
                <Button className={styles.modalBtn}>View transaction</Button>
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
            {pid != "128" ? (
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
                        {asset.price} CET
                      </Text>
                      <Text className={styles.modalSubtitle}>
                        ${(asset.price * 0.04).toFixed(2)} USD
                      </Text>
                    </VStack>
                  )}
                </HStack>
              </HStack>
            ) : (
              <HStack className={styles.modalSubContainer}>
                <Image
                  alt="modal"
                  src="/kirby.png"
                  className={styles.modalImage}
                ></Image>
                <HStack className={styles.modalSubTextContainer}>
                  <VStack alignItems="flex-start">
                    <Text className={styles.modalTitle}>{kirby.name}</Text>
                    <Text className={styles.modalSubtitle}>
                      {kirby.collection}
                    </Text>
                  </VStack>
                  {!isSell && (
                    <VStack alignItems="flex-end">
                      <Text className={styles.modalTitle}>
                        {kirby.price} CET
                      </Text>
                      <Text className={styles.modalSubtitle}>
                        ${kirby.fiat} USD
                      </Text>
                    </VStack>
                  )}
                </HStack>
              </HStack>
            )}
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
                    <Text className={styles.inputUnit}>CET</Text>
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
            <Button className={styles.modalBtn} onClick={() => purchaseNFT?.()}>
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
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isOwner = true;

  const { pid } = router.query;

  if (pid == undefined) return;

  if (pid == "128") {
    return (
      <VStack className={styles.main}>
        <TradeModal
          isOpen={isOpen}
          onClose={onClose}
          isSell={isOwner}
          pid={pid}
        />
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
                position: [10, 10, 10],
                rotation: [0, 0, 0],
              }}
            >
              <pointLight position={[50, 70, 50]} intensity={1} />
              <pointLight position={[-50, 70, 50]} intensity={1} />
              <rectAreaLight
                width={3}
                height={3}
                color={"#fff"}
                intensity={10}
                position={[-2, 0, 5]}
                lookAt={[0, 0, 0]}
                penumbra={1}
                castShadow
              />

              <Kirby />
              {/* <Kirby position={[0, 0.5, 0]} /> */}
              <OrbitControls />
            </Canvas>
          </Suspense>
        </VStack>
        <HStack alignItems="flex-start" gap="1rem" pt="1rem">
          <VStack alignItems="flex-start">
            <Text className={styles.title}>{kirby.name}</Text>
            <Text className={styles.subtitle}>{kirby.description}</Text>
            <VStack className={styles.minterContainer}>
              <Text className={styles.minterTitle} m={0}>
                Collection
              </Text>
              <HStack>
                <Image
                  alt="user"
                  src="/favicon.ico"
                  className={styles.minterImage}
                ></Image>
                <Text className={styles.minter}>{kirby.collection}</Text>
              </HStack>
            </VStack>
            <VStack gap="1rem">
              <VStack className={styles.sectionContainer}>
                <VStack className={styles.sectionTitleContainer}>
                  <Text className={styles.sectionTitle}>History</Text>
                </VStack>
                <HStack w="100%" pb="1rem">
                  <HStack w="100%">
                    <Image
                      alt="user"
                      src="/user.png"
                      className={styles.historyImage}
                    ></Image>
                    <VStack className={styles.historyRightSection}>
                      <Text m={0}>
                        <Text as="span" className={styles.historyTitle}>
                          0x3748...f2BC
                        </Text>{" "}
                        created this asset
                      </Text>
                      <Text className={styles.historySubtitle}>
                        Saturday, October 8, 2022 at 08:47:25
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>
              </VStack>
              <VStack className={styles.sectionContainer}>
                <VStack className={styles.sectionTitleContainer}>
                  <Text className={styles.sectionTitle}>Properties</Text>
                </VStack>
                <SimpleGrid columns={3} gap="1rem">
                  <VStack className={styles.propertyCell}>
                    <Text className={styles.propertyTitle}>Color</Text>
                    <Text className={styles.propertySubtitle}>Pink</Text>
                  </VStack>
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
                <Text className={styles.priceTag}>{asset.price} CET</Text>
              )}
              {!isOwner && (
                <Text className={styles.priceUSD}>
                  ${(asset.price * 0.04).toFixed(2)} USD
                </Text>
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
              {[184.29, 130.12, 93.09].map((num) => (
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
                    <Text className={styles.historyTitle}>{num} CET</Text>
                    <Text className={styles.historySubtitle}>
                      ${(num * 0.04).toFixed(2)} USD
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
                <VStack className={styles.propertyCell}>
                  <Text className={styles.propertyTitle}>Background</Text>
                  <Text className={styles.propertySubtitle}>Gray</Text>
                </VStack>

                <VStack className={styles.propertyCell}>
                  <Text className={styles.propertyTitle}>Material</Text>
                  <Text className={styles.propertySubtitle}>
                    Stainless steel
                  </Text>
                </VStack>

                <VStack className={styles.propertyCell}>
                  <Text className={styles.propertyTitle}>Signature Tint</Text>
                  <Text className={styles.propertySubtitle}>Red</Text>
                </VStack>

                <VStack className={styles.propertyCell}>
                  <Text className={styles.propertyTitle}>Weapon</Text>
                  <Text className={styles.propertySubtitle}>
                    Blaster cannon
                  </Text>
                </VStack>

                <VStack className={styles.propertyCell}>
                  <Text className={styles.propertyTitle}>Origin</Text>
                  <Text className={styles.propertySubtitle}>
                    Galactic Empire
                  </Text>
                </VStack>
                <VStack className={styles.propertyCell}>
                  <Text className={styles.propertyTitle}>Model</Text>
                  <Text className={styles.propertySubtitle}>T-70</Text>
                </VStack>
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
              <Text className={styles.priceTag}>{asset.price} CET</Text>
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
