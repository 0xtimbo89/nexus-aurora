import {
  VStack,
  Image,
  HStack,
  Text,
  Box,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import styles from "@styles/Collection.module.css";
import ImageContainer from "@components/ImageContainer";
import { collectionAssets, exploreAssets } from "@data/assets";

function Collection() {
  return (
    <VStack className={styles.main}>
      <VStack className={styles.collectionImageContainer}>
        <VStack className={styles.collectionCoverImageContainer}>
          <Image
            alt="cover"
            src="/cover.jpg"
            className={styles.collectionCoverImage}
          ></Image>
        </VStack>
        <Image
          alt="profile"
          src="/fighter.png"
          className={styles.collectionProfileImage}
        ></Image>
      </VStack>
      <VStack className={styles.titleTextContainer}>
        <Text className={styles.title}>Space Fighters (3rd Edition)</Text>
        <HStack>
          <Text className={styles.username}>By</Text>
          <Image
            alt="user"
            src="/user.png"
            className={styles.userImage}
          ></Image>
          <Text className={styles.username}>0xfa87...a497</Text>
        </HStack>
        <Text className={styles.subtitle}>
          Space fighters are small, maneuverable spacecraft designed for combat
          in space. They are equipped with weapons and armor, and often have
          powerful engines and maneuverability systems.
        </Text>
        <HStack className={styles.statsContainer}>
          <HStack>
            <Text className={styles.attribute}>Total volume</Text>
            <Image alt="csc" src="/csc.png" className={styles.csc}></Image>
            <Text className={styles.attributeBold}>
              <Text fontWeight={700} as="span">
                4819
              </Text>{" "}
              ·
            </Text>
          </HStack>
          <HStack>
            <Text className={styles.attribute}>Floor price</Text>
            <Image alt="csc" src="/csc.png" className={styles.csc}></Image>
            <Text>
              <Text fontWeight={700} as="span">
                0.2
              </Text>{" "}
              ·
            </Text>
          </HStack>
          <Text className={styles.attribute}>
            Items{" "}
            <Text fontWeight={700} as="span">
              8.4K
            </Text>{" "}
            · Created{" "}
            <Text fontWeight={700} as="span">
              Oct 2022
            </Text>
          </Text>
        </HStack>
      </VStack>
      <Box className={styles.divider}></Box>
      <HStack className={styles.sectionTitleContainer}>
        <Text className={styles.sectionTitle}>7777 items</Text>
      </HStack>
      <SimpleGrid columns={4} w="100%" gap="1rem">
        {collectionAssets.map(({ name, listing, image }, idx) => (
          <ImageContainer
            key={idx}
            image={image}
            title={name}
            subtitle={`Listing ${listing} CET`}
            link="/collection/0x7d3bc6b5de22a9bf0fd0c86954f42021736d4532/1"
          />
        ))}
      </SimpleGrid>
      <VStack pt="2rem">
        <Button className={styles.landingBtn}>Load more</Button>
      </VStack>
    </VStack>
  );
}

export default Collection;
