import { VStack, Text, Image } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import Link from "next/link";

type ImageProps = {
  w?: string;
  h?: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
};

function ImageContainer({
  w = "100%",
  h = "100%",
  image,
  title,
  subtitle,
  link,
}: ImageProps) {
  return (
    <Link href={link ?? ""}>
      <VStack
        w={w}
        h={h}
        className={styles.landingImageContainer}
        cursor="pointer"
      >
        <Image
          alt="image alt"
          src={image}
          w={w}
          h={h}
          className={styles.landingImage}
        ></Image>
        <VStack className={styles.landingImageCaption}>
          {title && (
            <Text className={styles.landingImageCaptionTitle}>{title}</Text>
          )}
          {subtitle && (
            <Text className={styles.landingImageCaptionSubtitle}>
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>
    </Link>
  );
}

export default ImageContainer;
