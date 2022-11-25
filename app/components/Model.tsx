import "@google/model-viewer";

type ModelProps = {
  modelSrc?: string;
  imageSrc?: string;
};

function Model({ modelSrc, imageSrc }: ModelProps) {
  return (
    // @ts-ignore
    <model-viewer
      src={
        modelSrc ??
        "https://bafybeiatpdb6cmkyhc4mu36yyhatxysk72lppgfof4xvinmr5pfxrfqc6a.ipfs.w3s.link/model.glb"
      }
      alt="3D model"
      shadow-intensity="1"
      exposure="1.5"
      camera-controls
      auto-rotate
      camera-orbit="0deg 75deg 100%"
      style={{
        width: "100%",
        height: "550px",
        cursor: "pointer",
        borderRadius: "5px",
      }}
    />
  );
}

export default Model;
