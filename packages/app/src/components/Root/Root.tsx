import React, { FC, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';
import BuildIcon from '@material-ui/icons/BuildRounded';
import RuleIcon from '@material-ui/icons/AssignmentTurnedIn';
import MapIcon from '@material-ui/icons/MyLocation';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Sidebar,
  SidebarPage,
  sidebarConfig,
  SidebarContext,
  SidebarItem,
  SidebarDivider,
  SidebarSearchField,
  SidebarSpace,
  SidebarUserSettings,
  SidebarThemeToggle,
  SidebarPinButton,
} from '@backstage/core';
import { NavLink } from 'react-router-dom';
import { graphiQLRouteRef } from '@backstage/plugin-graphiql';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo: FC<{}> = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

const handleSearch = (query: string): void => {
  // XXX (@koroeskohr): for testing purposes
  // eslint-disable-next-line no-console
  console.log(query);
};

const Root: FC<{}> = ({ children }) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarSearchField onSearch={handleSearch} />
      <SidebarDivider />
      {/* Global nav, not org-specific */}
      <SidebarItem icon={HomeIcon} to="./" text="Home" />
      <SidebarItem icon={ExploreIcon} to="explore" text="Explore" />
      <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
      <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
      {/* End global nav */}
      <SidebarDivider />
      <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
      <SidebarItem icon={RuleIcon} to="lighthouse" text="Lighthouse" />
      <SidebarItem icon={BuildIcon} to="circleci" text="CircleCI" />
      <SidebarItem
        icon={graphiQLRouteRef.icon!}
        to={graphiQLRouteRef.path}
        text={graphiQLRouteRef.title}
      />
      <SidebarSpace />
      <SidebarDivider />
      <SidebarThemeToggle />
      <SidebarUserSettings />
      <SidebarPinButton />
    </Sidebar>
    {children}
  </SidebarPage>
);

Root.propTypes = {
  children: PropTypes.node,
};

export default Root;
