function lastElement(array) { return array[array.length - 1] }

export default function ({ types: t }) {
    return {
        name: "decomma",
        visitor: {
            LogicalExpression(path) {
                const n = path.node;
                if (n.operator === '&&' &&
                    t.isSequenceExpression(n.right) &&
                    t.isExpressionStatement(path.parent)) {
                    path.parentPath.replaceWith(t.ifStatement(
                      /* if ( */ n.left, /* ) */
                      t.blockStatement([ /* { */
                        t.expressionStatement(n.right)
                      /* } */])
                    ));
                    path.skip(); // it's now invalid
                }
            },
            SequenceExpression(path) {
                if (t.isForStatement(path.parent)) {
                    // ignore comma in for, it's kinda standard
                    return;
                }
                const parentCtx = path.findParent(p => t.isBlock(p));
                if (parentCtx === null) {
                    throw path.buildCodeFrameError("parentCtx is null, expected to find Block");
                }
                // insert all but last expression before the current line
                const exprs = path.node.expressions;
                for(let i = exprs.length - 2; i >= 0; i--) {
                    const node = exprs[i];
                    const expr = t.isStatement(node) ? node : t.expressionStatement(node);
                    parentCtx.unshiftContainer('body', expr);
                }
                // replace the comma expression with its result (last expr)
                path.replaceWith(lastElement(path.node.expressions));
            }
        }
    };
}
