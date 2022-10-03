// hooks
//
import { MAvatar } from './@material-extend';
import createAvatar from '../utils/createAvatar';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const user = useSelector((state) => state.user.current);

  return (
    <MAvatar
      src={user?.photoURL || 'https://cdn.quasar.dev/img/avatar4.jpg'}
      alt={user?.fullname}
      color={user?.photoURL ? 'default' : createAvatar(user.fullname).color}
      {...other}
    >
      {createAvatar(user.fullname).name}
    </MAvatar>
  );
}
