import { VStack, Image, HStack, Text, Box, SimpleGrid } from "@chakra-ui/react";
import styles from "@styles/Profile.module.css";
import ImageContainer from "@components/ImageContainer";
import { exploreAssets } from "@data/assets";
import { myAssets } from "../data/assets";

function Profile() {
  return (
    <VStack className={styles.main}>
      <VStack className={styles.collectionImageContainer}>
        <VStack className={styles.collectionCoverImageContainer}>
          <Image
            alt="cover"
            src="/f.png"
            className={styles.collectionCoverImage}
          ></Image>
        </VStack>
        <Image
          alt="profile"
          src="/images.png"
          className={styles.collectionProfileImage}
        ></Image>
      </VStack>
      <VStack className={styles.titleTextContainer}>
        <Text className={styles.title}>0xtimboland</Text>
        <HStack>
          <Image
            alt="user"
            src="/user.png"
            className={styles.userImage}
          ></Image>
          <Text className={styles.username}>0x3748...f2BC</Text>
        </HStack>
        <Text className={styles.subtitle}>
          I am the ruthless NFT collector in the nexus neverland
        </Text>
      </VStack>
      <Box className={styles.divider}></Box>
      <HStack className={styles.sectionTitleContainer}>
        <Text className={styles.sectionTitle}>3 items</Text>
      </HStack>
      <SimpleGrid columns={4} w="100%" gap="1rem">
        {myAssets.map(({ image, name, listing }, idx) => (
          <ImageContainer
            key={idx}
            image={image}
            title={name}
            subtitle={
              listing === "Unlisted" ? listing : `Listing ${listing} CET`
            }
            link="/collection/1/1"
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
}

export default Profile;
