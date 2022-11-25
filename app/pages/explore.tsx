import { HStack, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ImageContainer from "@components/ImageContainer";
import styles from "@styles/Home.module.css";

const collections = [
  {
    description:
      "Journey is a wordless story told through gameplay and visual-only cutscenes.",
    name: "Journey",
    image:
      "https://bafybeic4e6qv3qggdy7ezgz5oghejfpzsfjeeq7nw7gj6zwhejpe7om4ja.ipfs.w3s.link/journey.png",
    creator: "TP6DvETy8HmRbZWrLLDJFkjA19oe16UBPq",
    address: "TJPq4YNHnDidiEUm7woN6vsLXhdLUVT4bZ",
  },
  {
    name: "Slender Man: The Arrival",
    description:
      "Slender Man is a fictional supernatural character that originated as a creepypasta Internet meme created by Something Awful forum user Eric Knudsen in 2009. He is depicted as a thin, unnaturally tall humanoid with a featureless head and face, wearing a black suit.",
    image:
      "https://bafybeihjy355g56qn35qwkdypbnrdrezg26antsxci5xg4qcmlg6uuas2a.ipfs.w3s.link/s.png",
    creator: "TP6DvETy8HmRbZWrLLDJFkjA19oe16UBPq",
    address: "TFYZNWX1vkv3wovsLcEkQMLeQBYfPMs2Ap",
  },
  {
    name: "Pokemon 2022 (Melee Ver.)",
    description:
      "Pokémon are creatures of all shapes and sizes who live in the wild or alongside their human partners. During their adventures, Pokémon grow and become more experienced and even, on occasion, evolve into stronger Pokémon. Hundreds of known Pokémon inhabit the Pokémon universe, with untold numbers waiting to be discovered!",
    creator: "TP6DvETy8HmRbZWrLLDJFkjA19oe16UBPq",
    image:
      "https://bafybeifzqr6z4s5wqalnhy2warxknpoa4asaquom7cj4s22sbvnxbqisnq.ipfs.w3s.link/pokemon.png",
    address: "TCbQV7iV7gTAXsLdVSxMruLzzWPffZPj4Y",
  },
];

const trending = [
  {
    name: "Space Fighters (3rd Edition)",
    description:
      "Space fighters are small, maneuverable spacecraft designed for combat in space. They are equipped with weapons and armor, and often have powerful engines and maneuverability systems.",
    creator: "TP6DvETy8HmRbZWrLLDJFkjA19oe16UBPq",
    image:
      "https://bafybeicmjs4hm563kgu4r65qblocqq5nuvx3el337a3ayeww6ovcpwoo64.ipfs.w3s.link/fighter.png",
    address: "TJXL51C7YCNstnepHHW6cKo6RU4ebCwEZk",
  },
  {
    name: "Nexus Protocol Collection 3",
    description:
      "Nexus Protocol Collection is a collection for users on the platform to mint their own 3D metaverse assets.",
    creator: "TP6DvETy8HmRbZWrLLDJFkjA19oe16UBPq",
    image:
      "https://bafybeibkelaonwkpaerrpqhkifxlvxzlqj5dbdurxshalkfruykmxcscie.ipfs.w3s.link/nexus.png",
    address: "TVjHb2Sj5qA5kLEoNUJDksfZ1P2FXy7rNs",
  },
];

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
            <Tab w="100%">Games</Tab>
            <Tab w="100%">Trending</Tab>
            <Tab w="100%">Categories</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={3} w="100%" gap={3}>
                {collections.map(({ image, name, address }, idx) => (
                  <ImageContainer
                    key={idx}
                    image={image}
                    title={name}
                    h="400px"
                    link={`/collection/${address}`}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <SimpleGrid columns={3} w="100%" gap={3}>
                {trending.map(({ image, name, address }, idx) => (
                  <ImageContainer
                    key={idx}
                    image={image}
                    title={name}
                    h="400px"
                    link={`/collection/${address}`}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <VStack h="400px" justifyContent="center">
                <Text fontSize="20px">Coming soon...</Text>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </VStack>
  );
}

export default Explore;
