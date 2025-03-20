import {
  Card,
  Page,
  Button,
  TextField,
  Layout,
  BlockStack,
  Banner,
  Select
} from "@shopify/polaris";
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Form, useActionData } from '@remix-run/react';
import { authenticate } from '../shopify.server';
import React, { useState, useCallback } from 'react';
import { createBanner, fetchBanners } from "../modules/banner/service";

export const loader = async ({ request }) => {
  try {
    await authenticate.admin(request);
    const banners = await fetchBanners();
    return json({ banners });
  } catch (error) {
    console.error("Loader Error:", error);
    return json({ banners: [] });
  }
};

export const action = async ({ request }) => {
  
  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log(intent,'intent');
  

  try {
      const title = formData.get("title");
      const image = formData.get("image");
      const status = formData.get("status");
      const link = formData.get("link");
      
      if (!title || !image || !status || !link) {
        return json({ error: "All fields are required" }, { status: 400 });
      }
      
      await createBanner({ title, image, status, link });
    
    return redirect("/app/bannerlist");
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function BannersPage() {
  const actionData = useActionData();

  const [title, setTitle] = useState('');
  const handleTitleChange = useCallback(
    (newValue) => setTitle(newValue),
    [],
  );

  const [imageUrl, setImageUrl] = useState('');
  const handleImageUrlChange = useCallback(
    (newValue) => setImageUrl(newValue),
    [],
  );

  const [link, setLink] = useState('');
  const handleLinkChange = useCallback(
    (newValue) => setLink(newValue),
    [],
  );

  const [status, setStatus] = useState('Active');
  const handleStatusChange = useCallback(
    (value) => setStatus(value),
    [],
  );

  const options = [
    {label: 'Active', value: 'Active'},
    {label: 'Draft', value: 'Draft'}
  ];

  return (
    <Form method="post">
      {actionData?.error && (
        <Banner title="Error" tone="critical">
          {actionData.error}
        </Banner>
      )}
      
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="image" value={imageUrl} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="link" value={link} />
      
      <Page
        title="Create Banner"
        backAction={{content: 'Banner List', url: '/app/bannerlist'}}
        primaryAction={
          <Button submit variant="primary">
            Save
          </Button>
        }
      >
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <TextField
                  label="Banner Title"
                  value={title}
                  onChange={handleTitleChange}
                  autoComplete="off"
                  required
                />
                <TextField
                  label="Image URL"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  autoComplete="off"
                  required
                  helpText="Enter the URL of the image from the Shopify files"
                />
                <TextField
                  label="Link URL"
                  value={link}
                  onChange={handleLinkChange}
                  autoComplete="off"
                  required
                  helpText="Where should this banner link to?"
                />
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Select
                  label="Banner Status"
                  options={options}
                  onChange={handleStatusChange}
                  value={status}
                />
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Form>
  );
}