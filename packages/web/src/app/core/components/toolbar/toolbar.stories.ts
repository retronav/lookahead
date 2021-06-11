// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Auth } from '@angular/fire';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { AppModule } from 'src/app/app.module';
import { ToolbarComponent } from './toolbar.component';

export default {
  title: 'Components/Toolbar',
  component: ToolbarComponent,
  argTypes: {},
} as Meta;

const Template: Story<ToolbarComponent> = (args: ToolbarComponent) => ({
  props: args,
  moduleMetadata: { providers: [Auth] },
});

export const NotSignedIn = Template.bind({});
