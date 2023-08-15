import { IKContext } from "imagekitio-react";
import { imageKitConfig } from "../config";

export const ImageKitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <IKContext
      urlEndpoint={imageKitConfig.endpoint}
      publicKey={imageKitConfig.publicKey}
    >
      {children}
    </IKContext>
  );
};
