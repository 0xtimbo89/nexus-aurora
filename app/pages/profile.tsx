import { VStack, Image, HStack, Text, Box, SimpleGrid } from "@chakra-ui/react";
import styles from "@styles/Profile.module.css";
import ImageContainer from "@components/ImageContainer";
import { useCallback, useEffect, useState } from "react";
import { fetchUser } from "@utils/web3";
import { abridgeAddress } from "@utils/abridgeAddress";
import { useAccount } from "wagmi";

function Profile() {
  const { address } = useAccount();
  const [assets, setAssets] = useState<any[]>([]);
  const [date, setDate] = useState("");

  const fetchUserInfo = useCallback(async () => {
    if (!address) return [];
    const user = await fetchUser(address as string);

    if (user) {
      const assetMetadata = Object.values(user.assets).map((asset: any) => {
        const metadata = asset.metadata;
        metadata.address = asset.address;
        metadata.tokenId = asset.tokenId;
        return metadata;
      });

      setDate(user.createdAt);
      setAssets(assetMetadata);
    }
  }, [address]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

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

  return (
    <VStack className={styles.main}>
      <VStack className={styles.collectionImageContainer}>
        <VStack className={styles.collectionCoverImageContainer}>
          <Image
            alt="cover"
            src={"/nexus.jpg"}
            className={styles.collectionCoverImage}
          ></Image>
        </VStack>
        <Image
          alt="profile"
          src="/user.png"
          className={styles.collectionProfileImage}
        ></Image>
      </VStack>
      <VStack className={styles.titleTextContainer}>
        {/* <Text className={styles.title}>0xtimboland</Text> */}
        <HStack>
          {/* <Image
            alt="user"
            src="/user.png"
            className={styles.userImage}
          ></Image> */}
          {/* <Text className={styles.username}>
            User {abridgeAddress(address)}
          </Text> */}
          <Text className={styles.username}>{abridgeAddress(address)}</Text>
        </HStack>
        <Text className={styles.subtitle}>Joined on {date}</Text>
      </VStack>
      <Box className={styles.divider}></Box>
      <HStack className={styles.sectionTitleContainer}>
        <Text className={styles.sectionTitle}>{assets.length} items</Text>
      </HStack>
      <SimpleGrid columns={4} w="95%" gap="1rem">
        {assets.map(
          ({ image_url, name, collection, address, tokenId }, idx) => (
            <ImageContainer
              key={idx}
              image={image_url}
              title={name}
              subtitle={collection}
              link={`/collection/${address}/${tokenId}`}
              w="300px"
              h="300px"
            />
          )
        )}
      </SimpleGrid>
    </VStack>
  );
}

export default Profile;
