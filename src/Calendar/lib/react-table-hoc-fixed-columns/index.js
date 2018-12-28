import { enableStickyPosition } from './helpers';
import withFixedColumnsStickyPosition from './stickyPosition/index';
import withFixedColumnsScrollEvent from './scrollEvent/index';

const withFixedColumns = enableStickyPosition()
    ? withFixedColumnsStickyPosition
    : withFixedColumnsScrollEvent; // use for legacy browser

export {
    withFixedColumnsStickyPosition,
    withFixedColumnsScrollEvent,
};

export default withFixedColumns;