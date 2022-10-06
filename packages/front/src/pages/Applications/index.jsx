import React from 'react';
import { IoIosApps } from 'react-icons/io';

import { TitleSection } from '../../components/Cells';
import { FavoritesSection } from '../../components/Organisms';
import { HeaderWrapper } from '../../components/Species';

function Applications() {
  return (
    <HeaderWrapper icon={IoIosApps} title="Applications">
      <div>
        <FavoritesSection />
        <TitleSection
          color="content1"
          borderColor="background3"
          variant="underlined"
          title="Toutes les applications"
          icon={IoIosApps}
        />
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Applications);
