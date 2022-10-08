import {
  Button,
  HStack,
  VStack,
  Text,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { categories, featured, games, trendingAssets } from "../data/assets";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <HStack className={styles.landingContainer}>
          <VStack className={styles.landingTextContainer}>
            <Text className={styles.landingTitle}>
              Create, trade, and showcase Metaverse 3D assets
            </Text>
            <Text className={styles.landingSubtitle}>
              Nexus is the world’s first metaverse-focused marketplace built on
              the CoinEx Smart Chain
            </Text>
            <HStack>
              <Link href="/explore">
                <Button className={styles.landingBtn}>Explore</Button>
              </Link>
              <Link href="/create">
                <Button className={styles.landingBtn}>Create</Button>
              </Link>
            </HStack>
          </VStack>
          <Link href={`/collection/0x7d3bc6b5de22a9bf0fd0c86954f42021736d4532`}>
            <VStack
              w="550px"
              className={styles.landingImageContainer}
              cursor="pointer"
            >
              <Image
                alt="image alt"
                src="/fighter.png"
                className={styles.landingImage}
              ></Image>
              <VStack className={styles.landingImageCaption}>
                <Text className={styles.landingImageCaptionTitle2}>
                  SF Light - Fighter X6
                </Text>
                <Text className={styles.landingImageCaptionSubtitle2}>
                  Floor: 8 CET
                </Text>
              </VStack>
            </VStack>
          </Link>
        </HStack>
        <VStack w="100%" pt="1rem" pb="1rem">
          <HStack className={styles.sectionTitleContainer}>
            <Text className={styles.sectionTitle}>Explore</Text>
            <Link href="/explore">
              <Text className={styles.sectionSubtitle} cursor="pointer">
                View more
              </Text>
            </Link>
          </HStack>
          <HStack w="100%">
            {featured.map(({ image, name, floor }, idx) => (
              <VStack className={styles.categoryContainer} key={idx}>
                <Image
                  alt="image alt"
                  src={image}
                  className={styles.exploreImage}
                ></Image>
                <VStack className={styles.landingImageCaption}>
                  <Text className={styles.landingImageCaptionTitle}>
                    {name}
                  </Text>
                  <Text className={styles.landingImageCaptionSubtitle}>
                    Floor: {floor} CET
                  </Text>
                </VStack>
              </VStack>
            ))}
          </HStack>
        </VStack>
        <VStack w="100%">
          <HStack className={styles.sectionTitleContainer}>
            <Text className={styles.sectionTitle}>Trending</Text>
          </HStack>
          <Box className={styles.divider}></Box>
          <HStack>
            <TableContainer>
              <Table variant="unstyled">
                <Thead>
                  <Tr className={styles.headerContainer}>
                    <Th className={styles.headerLabel}>#</Th>
                    <Th className={styles.headerLabel}>Collection</Th>
                    <Th className={styles.headerLabel}>Floor Price</Th>
                    <Th className={styles.headerLabel}>Volume</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {trendingAssets
                    .slice(0, 5)
                    .map(({ rank, image, collection, floor, volume }: any) => (
                      <Tr
                        key={rank}
                        onClick={() => {}}
                        className={styles.rowContainer}
                      >
                        <Td className={styles.tableCell}>{rank}</Td>
                        <Td>
                          <HStack gap={5}>
                            <Image
                              alt="hi"
                              src={image}
                              className={styles.trendingImage}
                            ></Image>
                            <Text>{collection}</Text>
                          </HStack>
                        </Td>
                        <Td className={styles.tableCell}>{floor} CET</Td>
                        <Td className={styles.tableCell}>{volume}M CET</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
            <TableContainer>
              <Table variant="unstyled">
                <Thead>
                  <Tr className={styles.headerContainer}>
                    <Th className={styles.headerLabel}>#</Th>
                    <Th className={styles.headerLabel}>Collection</Th>
                    <Th className={styles.headerLabel}>Floor Price</Th>
                    <Th className={styles.headerLabel}>Volume</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {trendingAssets
                    .slice(5, 10)
                    .map(({ rank, image, collection, floor, volume }: any) => (
                      <Tr
                        key={rank}
                        onClick={() => {}}
                        className={styles.rowContainer}
                      >
                        <Td className={styles.tableCell}>{rank}</Td>
                        <Td className={styles.tableCollectionCell}>
                          <HStack gap={5}>
                            <Image
                              alt="hi"
                              src={image}
                              className={styles.trendingImage}
                            ></Image>
                            <Text>{collection}</Text>
                          </HStack>
                        </Td>
                        <Td className={styles.tableCell}>{floor} ETH</Td>
                        <Td className={styles.tableCell}>{volume} ETH</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </HStack>
        </VStack>
        <VStack w="100%">
          <HStack className={styles.sectionTitleContainer}>
            <Text className={styles.sectionTitle}>Game spotlight</Text>
          </HStack>
          <HStack w="100%">
            {games.map(({ image, name }, idx) => (
              <Link href="/explore" key={idx}>
                <VStack className={styles.categoryContainer}>
                  <Image
                    alt="image alt"
                    src={image}
                    className={styles.categoryImage}
                  ></Image>
                  <VStack className={styles.landingImageCaption}>
                    <Text className={styles.categoryCaptionTitle}>{name}</Text>
                  </VStack>
                </VStack>
              </Link>
            ))}
          </HStack>
        </VStack>
        <VStack w="100%">
          <HStack className={styles.sectionTitleContainer}>
            <Text className={styles.sectionTitle}>Browse by category</Text>
          </HStack>
          <SimpleGrid columns={3} w="100%" gap={2}>
            {categories.map(({ name, image }, idx) => (
              <Link href="/explore" key={idx}>
                <VStack className={styles.categoryContainer}>
                  <Image
                    alt="image alt"
                    src={image}
                    className={styles.categoryImage}
                  ></Image>
                  <VStack className={styles.landingImageCaption}>
                    <Text className={styles.categoryCaptionTitle}>{name}</Text>
                  </VStack>
                </VStack>
              </Link>
            ))}
          </SimpleGrid>
        </VStack>
      </main>
      <Box className={styles.ellipseOverlay}></Box>
      <Image alt="hero" src="/earth.png" className={styles.ellipse}></Image>
      <Box className={styles.heroOverlay1}></Box>
      <Box className={styles.heroOverlay2}></Box>
      <Box className={styles.heroOverlay3}></Box>
      <Image alt="hero" src="/hero.jpg" className={styles.heroImage}></Image>
    </div>
  );
};

export default Home;
