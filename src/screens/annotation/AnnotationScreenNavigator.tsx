import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationProp } from '../../types/navigation-types';
import AnnotationScreen from './AnnotationScreen';
import CustomDrawerContent from './components/DrawerContent';

type AnnotationScreenNavigatorPropsType = NavigationProp;

const NavigationDrawer = createDrawerNavigator();

function AnnotationScreenNavigator({
  route,
}: AnnotationScreenNavigatorPropsType) {
  const { type } = route.params.params; // Nested navigators seems to also nest params

  return (
    <NavigationDrawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerType: 'front',
      }}
      drawerContent={props => (
        <CustomDrawerContent fileType={type} {...props} />
      )}>
      <NavigationDrawer.Screen
        name="Annotation"
        component={AnnotationScreen}
        options={{ title: 'Hanot' }}
      />
    </NavigationDrawer.Navigator>
  );
}

export default AnnotationScreenNavigator;
