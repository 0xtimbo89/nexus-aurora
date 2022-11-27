# Nexus Protocol API V1

`GET https://nexus-server-kt42.onrender.com/users/:address/assets`

This endpoint returns a set of assets based on the specified user TRON address.

Sample request: [/users/TQ86Usnvjj1Je6cdPwGv2VMDMbFm1zEac5/assets](https://nexus-server-kt42.onrender.com/users/TQ86Usnvjj1Je6cdPwGv2VMDMbFm1zEac5/assets)

The endpoint will return the following fields:

| Field Name |      Description      |
| :--------: | :-------------------: |
|   assets   | List of Asset Objects |

An `asset` is defined by the following fields:

|    Field Name    |                   Description                   |
| :--------------: | :---------------------------------------------: |
| contract_address |            Address of NFT Collection            |
|     token_id     |                Token ID of asset                |
|       name       |                  Name of asset                  |
|   description    |              Description of asset               |
|  external_link   |            External link to website             |
|    image_url     |         URL hosting asset preview image         |
|    model_url     |           URL hosting asset 3D model            |
|  animation_url   | URL hosting asset 3D model (Opensea compatible) |
|    properties    |           Attributes describing asset           |

Example JSON blob:

```
{
  name: "Kirby",
  description: "Kirby is a small, pink, spherical creature who has the ability to inhale objects and creatures to gain their powers. He is often called upon to save his home world of Dream Land from various villains.",
  collection: "Nexus Protocol Collection 3",
  image_url: "https://bafybeie6rfxujzadhx5t3ofso6sckg33jknl5vhobmgby7uetpmbzaojvm.ipfs.w3s.link/preview.png",
  animation_url: "https://bafybeicegfiiccusrwdyn3yut5temunjejordfmktyedjkumafwmd3ixpa.ipfs.w3s.link/kirby.glb",
  model_url: "https://bafybeicegfiiccusrwdyn3yut5temunjejordfmktyedjkumafwmd3ixpa.ipfs.w3s.link/kirby.glb",
  attributes: [
    {
      "trait_type": "Background",
      "value": "Pink"
    }
  ]
}
```

## Client-side Reference Implementation

```javascript
useEffect(async () => {
    const assets = await axios.get("https://nexus-server-kt42.onrender.com//api/v1/assets/TSiY1b9bXh6ERoFeascqLEtXdiQxVNQnK7");
    const assetModelUrl = assets[0].model_url;
    const assetModel = await axios.get(assetModelUrl);
    setFetchedModel(assetModel); // gltf or glb file
})

<Canvas>
// render `assetModel` via three.js or react-three-fiber
</Canvas>
```

## Future Roadmap for API

The following endpoints are planning to be added as a follow-up:

- Retrieve collections
- Retrieve bundles
- Retrieve a contract
- Retrieve a collection
- Retrieve collection states
- Mint batched assets
