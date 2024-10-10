import React from 'react';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SortIcon from '@mui/icons-material/Sort';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';

type MenuItemProps = {
  name: string;
  value: string;
};

type Props = {
  menuItems: MenuItemProps[];
  iconButton?: {
    icon: React.ReactNode;
  };
  onMenuItemClick?: (value: string) => void;
};

export const CustomMenu: React.FC<Props> = ({ menuItems, iconButton, onMenuItemClick }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (_:  React.MouseEvent<HTMLElement>, value: string) => {
    setAnchorEl(null);
    onMenuItemClick?.(value);
  };

  const button = (
    iconButton ? (
      <IconButton aria-label="more-options" onClick={handleClick}>
        {iconButton.icon}
      </IconButton>
    ) : (
      <Fab 
        color='default'
        aria-controls={open ? 'fade-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label='Sort by' 
        size='small' 
        variant='extended' 
        aria-haspopup="true" 
        onClick={handleClick}
      >
        <SortIcon fontSize='small' color='primary' />
        <Typography variant="caption">
          Sort by
        </Typography>
      </Fab>
    )
  );
  
  return (
    <>
      { button }
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        slotProps={{
          paper: {
            style: {
              width: '25ch',
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem value={item.value} onClick={(event) => handleSelect(event, item.value)} key={`menu-item-${index}`}>{item.name}</MenuItem>
        ))}
      </Menu>
    </>
  );
};