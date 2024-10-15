import React, { useState } from "react";
import { ScrollArea, Stack, Box, Modal, Button } from "@mantine/core";
import { useViewportSize, useElementSize, useDisclosure } from "@mantine/hooks";
import ViewFoldersModal from "../Folders/ViewFoldersModal";

export default function SlideshowCreation() {
  const { height: viewportHeight, width: viewportWidth } = useViewportSize(); 
  const { ref, width: containerWidth } = useElementSize(); 
  const [buttons, setButtons] = useState([{ id: Date.now() }]);
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedButtonId, setSelectedButtonId] = useState(buttons[0].id); 

  const addButton = () => {
    const newButton = { id: Date.now() };
    setButtons([...buttons, newButton]);
    setSelectedButtonId(newButton.id); 
  };

  const removeButton = (id) => {
    if (buttons.length === 1) {
      return; 
    }

    const newButtons = buttons.filter((button) => button.id !== id);
    setButtons(newButtons);

    if (id === selectedButtonId) {
      const nextIndex = buttons.findIndex((button) => button.id === id) + 1;
      const newSelectedButton = newButtons[nextIndex]
        ? newButtons[nextIndex]
        : newButtons[newButtons.length - 1];
      setSelectedButtonId(newSelectedButton.id);
    }
  };

  const handleButtonClick = (id) => {
    setSelectedButtonId(id); 
  };

  const selectedButtonIndex = buttons.findIndex((button) => button.id === selectedButtonId);
  const selectedButtonText = selectedButtonIndex !== -1 ? `Button ${selectedButtonIndex + 1}` : "";

  const availableWidth = viewportWidth - containerWidth;

  return (
    <div className="slideshow-create-main">
      <span className="flex-column">
        <Button onClick={addButton} style={{ marginBottom: 10 }} w={containerWidth}>
          Pievienot Slaidu
        </Button>
        <ScrollArea type="scroll" w={200} h={viewportHeight}>
          <Stack ref={ref} align="flex-start" justify="flex-start" gap="md">
            {buttons.map((button, index) => (
              <div
                key={button.id}
                style={{
                  position: "relative",
                  width: containerWidth,
                  height: 90,
                }}
              >
                <Button w={containerWidth} h={90} onClick={() => handleButtonClick(button.id)}>
                  Button {index + 1}
                </Button>
                <Button
                  variant="subtle"
                  compact
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
                  }}
                >
                  X
                </Button>
              </div>
            ))}
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
          <button onClick={open}>{selectedButtonText || "Izvēlies bildi"}</button>
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
        <ViewFoldersModal />
      </Modal>
    </div>
  );
}
