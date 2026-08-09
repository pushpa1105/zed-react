import { Outlet } from 'react-router-dom';

import { AppLoader } from '../../components/loaders/AppLoader';
import { useLoader } from '../../context/loader';

const MainLayout = () => {
  const { appLoading } = useLoader();

  if (appLoading) return <AppLoader />;

  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
