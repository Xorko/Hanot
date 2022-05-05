import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { useFileType } from '../../../context/FileTypeContext';
import { useWebDrawer } from '../context/WebDrawerContext';
import WebDrawerContent from './WebDrawerContent';

/**
 * react-navigation drawer doesn't work on the web (on May 06 2022) hence we need
 * to use another drawer for the web version of the application.
 */
function WebDrawer() {
  const { isOpened, closeWebDrawer } = useWebDrawer();
  const { fileType } = useFileType();

  return (
    <Drawer open={isOpened} onClose={closeWebDrawer} direction="left">
      <WebDrawerContent fileType={fileType} />
    </Drawer>
  );
}

export default WebDrawer;
