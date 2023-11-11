import { useState } from 'react';
import { Tooltip, Snackbar } from '@mui/material';
import { shortAddress } from '../utils';

type TruncatedTextProps = {
  value: string;
};
export default function TruncatedText({ value }: TruncatedTextProps) {
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  const renderedValue = shortAddress(value);

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div onClick={handleCopyToClipboard}>
      <Tooltip
        title={value}
        open={isTooltipOpen}
        onOpen={handleTooltipOpen}
        onClose={handleTooltipClose}
        arrow
      >
        <span
          style={{
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {renderedValue}
        </span>
      </Tooltip>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Copied to clipboard"
      />
    </div>
  );
}
