import { ViewResolver } from './resolver-protocol';
import { Component, Autowired } from '../../common/annotation';
import { ViewProvider } from '../view/view-provider';
import { ViewMetadata } from '../annotation/view';
import { Context } from '../context';

@Component(ViewResolver)
export class ViewResolverImpl implements ViewResolver {

    @Autowired
    protected readonly viewProvider: ViewProvider;

    async resolve(metadata: any, model: any): Promise<void> {
        const viewMetadata = <ViewMetadata>metadata.viewMetadata;
        for (const view of this.viewProvider.provide()) {
            if (await view.support(viewMetadata.viewName)) {
                Context.getResponse().setHeader('Content-type', view.contentType);
                await view.render(model);
                return;
            }
        }
        throw new Error('Not found a suitable view.');
    }
}
