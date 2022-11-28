import { Metadata } from "./types";

const NEXUS_API_URL =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? process.env.NEXT_PUBLIC_API_PROD
    : process.env.NEXT_PUBLIC_API_DEV;

export async function fetchUser(address: string) {
  if (!address) return;
  try {
    const response = await fetch(`${NEXUS_API_URL}/users/${address}`);
    if (response.status === 200) {
      const user = await response.json();
      return user;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function fetchAssets() {
  try {
    const response = await fetch(`${NEXUS_API_URL}/assets`);
    if (response.status === 200) {
      const assets = await response.json();
      return assets;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function fetchAsset(address: string, tokenId: string) {
  try {
    const response = await fetch(
      `${NEXUS_API_URL}/assets/${address}/${tokenId}`
    );
    if (response.status === 200) {
      const asset = await response.json();
      return asset;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function fetchPrice() {
  try {
    const response = await fetch(`${NEXUS_API_URL}/utils/price/ETH`);
    if (response.status === 200) {
      const assets = await response.json();
      return assets;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function createUser(address: string) {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
      }),
    };
    await fetch(`${NEXUS_API_URL}/users/create`, requestOptions);
  } catch (err) {
    console.log(err);
  }
}

export async function addEvent(
  address,
  tokenId,
  eventType,
  price,
  fiatPrice,
  userAddress
) {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        tokenId,
        type: eventType,
        price,
        fiatPrice,
        userAddress,
      }),
    };

    await fetch(`${NEXUS_API_URL}/assets/event`, requestOptions);
  } catch (err) {
    console.log(err);
  }
}

export async function changeOwnership(
  address,
  tokenId,
  metadata,
  buyerAddress,
  sellerAddress
) {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        tokenId,
        metadata,
        buyerAddress,
        sellerAddress,
      }),
    };
    await fetch(`${NEXUS_API_URL}/users/ownership`, requestOptions);
  } catch (err) {
    console.log(err);
  }
}

export async function createAsset(
  address: string,
  tokenId: string,
  metadata: Metadata,
  userAddress: string
) {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        tokenId,
        metadata,
        userAddress,
      }),
    };
    await fetch(`${NEXUS_API_URL}/assets/create`, requestOptions);
  } catch (err) {
    console.log(err);
  }
}
