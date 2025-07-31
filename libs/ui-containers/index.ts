import { Screen } from './screen-container';
import { SubX, SubY } from './screen-sub-containers';

const Containers = {
  Screen,
  SubX,
  SubY,
} as const;

type ContainersType = typeof Containers;
type ContainerName = keyof ContainersType;

type ContainersProps = {
  [key in ContainerName]: Parameters<ContainersType[key]>[0];
};

export { Containers };
export type { ContainersProps };
