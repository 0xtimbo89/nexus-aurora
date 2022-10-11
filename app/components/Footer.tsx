import { HStack, Text } from "@chakra-ui/react";
import styles from "@styles/Footer.module.css";

function Footer() {
  return (
    <HStack className={styles.footer}>
      <Text color="rgba(255,255,255,0.6)">@ 2022 Nexus</Text>
      <Text color="rgba(255,255,255,0.6)">
        Built with ♡ for MetaFi CSC Challenge
      </Text>
    </HStack>
  );
}

export default Footer;
