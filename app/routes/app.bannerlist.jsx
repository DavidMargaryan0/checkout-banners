import {
  IndexTable,
  Card,
  Text,
  useBreakpoints,
  Page,
  Button,
  Tooltip,
  Modal,
  TextField,
  Thumbnail,
  Select,
  Form as PolarisForm,
  LegacyStack
} from "@shopify/polaris";
import { EditIcon, DeleteIcon } from '@shopify/polaris-icons';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Form, useActionData, useSubmit } from '@remix-run/react';
import { authenticate } from '../shopify.server';
import { createBanner, fetchBanners, fetchBanner, updateBanner, deleteBanner, fetchActiveBanner } from "../modules/banner/service";
import React, { useState } from 'react';

export const loader = async ({ request }) => {
  try {
    await authenticate.admin(request);
    const banners = await fetchBanners();
    return json({ banners });
  } catch (error) {
    console.error("Loader Error:", error.message);
    return json({ banners: [] });
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {    
    if (intent === "delete") {
      const id = formData.get("id");
      if (id) await deleteBanner(id);
    }

    if (intent === "update") {
      const id = formData.get("id");
      const title = formData.get("title");
      const image = formData.get("image");
      const status = formData.get("status");
      const link = formData.get("link");
      
      if (!id || !title || !image || !status || !link) {
        return json({ error: "All fields are required" }, { status: 400 });
      }

      await updateBanner(id, { title, image, status, link });
    }
    
    return redirect("/app/bannerlist");
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function BannerList() {
  const { banners } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  
  // State for edit modal
  const [editModalActive, setEditModalActive] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  
  // State for delete confirmation modal
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  
  // Form state for editing
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('');
  const [link, setLink] = useState('');

  // Open edit modal with banner data
  const handleEditClick = (banner) => {
    setCurrentBanner(banner);
    setTitle(banner.title);
    setImage(banner.image);
    setStatus(banner.status);
    setLink(banner.link);
    setEditModalActive(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setDeleteModalActive(true);
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("id", currentBanner._id);
    formData.append("title", title);
    formData.append("image", image);
    formData.append("status", status);
    formData.append("link", link);
    
    submit(formData, { method: "post" });
    setEditModalActive(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("id", bannerToDelete._id);
    
    submit(formData, { method: "post" });
    setDeleteModalActive(false);
  };

  const rowMarkup = banners.map(
    banner => (
      <IndexTable.Row id={banner._id} key={banner._id}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {banner._id}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{banner.title}</IndexTable.Cell>
        <IndexTable.Cell>
          <Thumbnail
            source={banner.image}
            alt={banner.title}
            size="extraSmall"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>{banner.status}</IndexTable.Cell>
        <IndexTable.Cell>{banner.link}</IndexTable.Cell>
        <IndexTable.Cell>
          <Tooltip content="Edit banner">
            <Button 
              plain
              variant="tertiary" 
              icon={EditIcon}
              onClick={() => handleEditClick(banner)}
            />
          </Tooltip>
          <Tooltip content="Delete banner">
            <Button 
              plain 
              destructive
              icon={DeleteIcon} 
              variant="tertiary" 
              tone="critical"
              onClick={() => handleDeleteClick(banner)}
            />
          </Tooltip>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page 
      backAction={{content: 'Banner List', url: '/app'}}
      title="Banner List"
      primaryAction={<Button variant="primary" url="/app/createbanner">Create Banner</Button>}
    >
      <Card>
        <IndexTable
          condensed={useBreakpoints().smDown}
          itemCount={banners.length}
          headings={[
            {title: 'ID'},
            {title: 'Title'},
            {title: 'Image'},
            {title: 'Status'},
            {title: 'link'},
            {title: 'Actions'}
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </Card>

      {/* Edit Modal */}
      <Modal
        open={editModalActive}
        onClose={() => setEditModalActive(false)}
        title="Edit Banner"
        primaryAction={{
          content: 'Save',
          onAction: handleEditSubmit,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setEditModalActive(false),
          },
        ]}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <TextField
              label="Title"
              value={title}
              onChange={setTitle}
              autoComplete="off"
            />
            <TextField
              label="Image URL"
              value={image}
              onChange={setImage}
              autoComplete="off"
            />
            <Select
              label="Status"
              options={[
                {label: 'Active', value: 'Active'},
                {label: 'Draft', value: 'Draft'},
              ]}
              value={status}
              onChange={setStatus}
            />
            <TextField
              label="Link URL"
              value={link}
              onChange={setLink}
              autoComplete="off"
            />
          </LegacyStack>
        </Modal.Section>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalActive}
        onClose={() => setDeleteModalActive(false)}
        title="Delete Banner"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          onAction: handleDeleteConfirm,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setDeleteModalActive(false),
          },
        ]}
      >
        <Modal.Section>
          <p>Are you sure you want to delete this banner? This action cannot be undone.</p>
        </Modal.Section>
      </Modal>
    </Page>
  );
}