function lastElement(array) { return array[array.length - 1] }

export default function ({ types: t }) {
    return {
        name: "decomma",
        visitor: {
            SequenceExpression(path) {
                if (t.isForStatement(path.parent)) {
                    // ignore comma in for, it's kinda standard
                    return;
                }
                const last = lastElement(path.node.expressions);
                const parentBlock = path.scope.block;
                const parentCtx = path.findParent(p => p.parent === parentBlock);
                if (parentCtx === null) {
                    throw path.buildCodeFrameError("parentCtx is null, expected to find block "
                     + JSON.stringify(parentBlock));
                }
                // insert most expressions before the current line
                path.node.expressions.forEach(expr => {
                    if (expr === last) {
                        return;
                    }
                    parentCtx.insertBefore(t.expressionStatement(expr))
                })
                // replace the comma expression with its result (last expr)
                path.replaceWith(last);
            }
        }
    };
}
