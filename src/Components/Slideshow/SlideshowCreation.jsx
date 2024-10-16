import React, { useState, useEffect } from "react";
import { ScrollArea, Stack, Box, Modal, Button } from "@mantine/core";
import { useViewportSize, useElementSize, useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setButtonsData } from "../../actions/imageActions";
import ViewFoldersModal from "../Folders/ViewFoldersModal";
import classes from "../../style/SlidesCreation.module.css";

export default function SlideshowCreation() {
  const { height: viewportHeight, width: viewportWidth } = useViewportSize();
  const { ref, width: containerWidth } = useElementSize();
  const { previewRef, height: previewHeight } = useElementSize();
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();
  const buttonsData = useSelector((state) => state.imageLinks);
  const [nextId, setNextId] = useState(1);
  const [selectedButtonId, setSelectedButtonId] = useState(buttonsData[0]?.id || 1);

  useEffect(() => {
    if (buttonsData.length === 0) {
      const initialButton = { id: nextId, imageLink: "" };
      dispatch(setButtonsData([initialButton]));
      setNextId((prevId) => prevId + 1);
    }
  }, [buttonsData, dispatch, nextId]);

  const addButton = () => {
    const newButton = { id: nextId, imageLink: "" };
    dispatch(setButtonsData([...buttonsData, newButton]));
    setSelectedButtonId(newButton.id);
    setNextId((prevId) => prevId + 1);
  };

  const removeButton = (id) => {
    if (buttonsData.length === 1) {
      return;
    }

    const updatedButtons = buttonsData.filter((button) => button.id !== id);
    dispatch(setButtonsData(updatedButtons));

    if (id === selectedButtonId) {
      const nextIndex = updatedButtons.findIndex((button) => button.id === id) + 1;
      const newSelectedButton = updatedButtons[nextIndex] || updatedButtons[updatedButtons.length - 1];
      setSelectedButtonId(newSelectedButton.id);
    }
  };

  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
  };

  const selectedButtonIndex = buttonsData.findIndex((button) => button.id === selectedButtonId);
  const selectedButtonText = selectedButtonIndex !== -1 ? `Button ${selectedButtonIndex + 1}` : "";
  const availableWidth = viewportWidth - containerWidth;

  // Find the image for the currently selected button
  const selectedImage = buttonsData.find(button => button.id === selectedButtonId)?.imageLink || "";

  return (
    <div className="slideshow-create-main">
      <span className="flex-column">
        <Button onClick={addButton} style={{ marginBottom: 10 }} w={containerWidth}>
          Pievienot Slaidu
        </Button>
        <ScrollArea type="scroll" w={200} h={viewportHeight}>
          <Stack ref={ref} align="flex-start" justify="flex-start" gap="md">
            {buttonsData.map((button, index) => {
              const correspondingImage = buttonsData.find(img => img.id === button.id)?.imageLink || "";
              return (
                <span className="preview-wrapper">
                <div
                ref={previewRef}
                className="aspect16-9"
                  key={button.id}
                  style={{
                    position: "relative",
                    width: containerWidth,
                  }}
                >
                  <Button
                    w={containerWidth}
                    h={112.5}
                    onClick={() => handleButtonClick(button.id)}
                    variant="outline"
                    color="gray"
                    classNames={{root: classes.root}}
                  >
                    <img className="slide-preview-image" src={correspondingImage} alt="" />
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => removeButton(button.id)}
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      zIndex: 1,
                      fontSize: 16,
                      width: 24,
                      height: 24,
                      padding: 0,
                      color: "red",
                      fontWeight: "bold",
                      zIndex:4,
                    }}
                  >
                    X
                  </Button>
                </div>
                </span>
              );
            })}
          </Stack>
        </ScrollArea>
      </span>
      <Box
        w={availableWidth - 10}
        h={viewportHeight}
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        ml={10}
      >
        <div className="aspect-ratio">
          <Button
            onClick={open} 
            classNames={{root: classes.root, label: classes.label}}
          >
            <span className="z4 big">{ selectedImage ? "" : "Izvēlies bildi"}</span>
            {selectedImage && (
              <img className="slide-preview-image" src={selectedImage} alt="Selected slide"/>
            )}
          </Button>
        </div>
      </Box>
      <Modal
        opened={opened}
        onClose={close}
        title="Bildes izvēle"
        overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}
        fullScreen
        >
            <ViewFoldersModal selectedButtonId={selectedButtonId} closeModal={close} />
        </Modal>
    </div>
  );
}
