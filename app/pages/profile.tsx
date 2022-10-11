import { VStack, Image, HStack, Text, Box, SimpleGrid } from "@chakra-ui/react";
import styles from "@styles/Profile.module.css";
import ImageContainer from "@components/ImageContainer";
import { exploreAssets } from "@data/assets";

function Profile() {
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
        <Text className={styles.title}>kenny93</Text>
        <HStack>
          <Image
            alt="user"
            src="/user.png"
            className={styles.userImage}
          ></Image>
          <Text className={styles.username}>0xfa87...a497</Text>
        </HStack>
        <Text className={styles.subtitle}>
          I am the ruthless NFT collector in neverland
        </Text>
      </VStack>
      <Box className={styles.divider}></Box>
      <HStack className={styles.sectionTitleContainer}>
        <Text className={styles.sectionTitle}>7777 items</Text>
      </HStack>
      <SimpleGrid columns={4} w="100%" gap="1rem">
        {[...exploreAssets, ...exploreAssets].map(
          ({ image, title, subtitle }, idx) => (
            <ImageContainer
              key={idx}
              image={image}
              title={title}
              subtitle={subtitle}
              link="/collection/1/1"
            />
          )
        )}
      </SimpleGrid>
    </VStack>
  );
}

export default Profile;
