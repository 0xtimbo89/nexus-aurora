import { HStack, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ImageContainer from "@components/ImageContainer";
import { exploreAssets } from "../data/assets";
import styles from "@styles/Home.module.css";

function Explore() {
  return (
    <VStack className={styles.main}>
      <VStack w="100%">
        <HStack className={styles.sectionTitleContainer}>
          <Text className={styles.sectionTitle}>Explore Collections</Text>
        </HStack>
        <Tabs
          colorScheme="#000000"
          size="lg"
          className={styles.tabContainer}
          variant="enclosed"
        >
          <TabList>
            <Tab w="100%">Trending</Tab>
            <Tab w="100%">Games</Tab>
            <Tab w="100%">Social</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={3} w="100%" gap={3}>
                {[...exploreAssets, ...exploreAssets].map(
                  ({ image, title, subtitle }, idx) => (
                    <ImageContainer
                      key={idx}
                      image={image}
                      title={title}
                      subtitle={subtitle}
                    />
                  )
                )}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <SimpleGrid columns={3} w="100%" gap={3}>
                {[...exploreAssets, ...exploreAssets].map(
                  ({ image, title, subtitle }, idx) => (
                    <ImageContainer
                      key={idx}
                      image={image}
                      title={title}
                      subtitle={subtitle}
                    />
                  )
                )}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <SimpleGrid columns={3} w="100%" gap={3}>
                {[...exploreAssets, ...exploreAssets].map(
                  ({ image, title, subtitle }, idx) => (
                    <ImageContainer
                      key={idx}
                      image={image}
                      title={title}
                      subtitle={subtitle}
                    />
                  )
                )}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </VStack>
  );
}

export default Explore;
