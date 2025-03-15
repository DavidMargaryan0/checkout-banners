import { useEffect, useState } from "react";
import {
  reactExtension,
  Banner,
  BlockStack,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  Image,
  Link,
} from "@shopify/ui-extensions-react/checkout";


async function fetchActiveBanner() {
  const baseUrL = process.env.APP_URL + '/api/banners/active'
  const response = await fetch(baseUrL);
  return response.json();
}

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();

  const [activeBanner, setActiveBanner] = useState(null);

  useEffect(() => {
    const loadActiveBanner = async () => {
      try {
        const bannerData = await fetchActiveBanner();
        setActiveBanner(bannerData.activeBanner);
        console.log("6676767676", bannerData);
      } catch (error) {
        console.error("Error fetching active banner:", error);
      }
    };
  
    
    loadActiveBanner();
  }, []);

  // Check instructions for feature availability
  if (!instructions.attributes.canUpdateAttributes) {
    return (
      <Banner title="checkout-ui" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      {activeBanner && (
        <Banner title={activeBanner.title} status="info">
          <Link to={activeBanner.link} target="_blank">
            <Image source={activeBanner.image} />
          </Link>
        </Banner>
      )}
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}