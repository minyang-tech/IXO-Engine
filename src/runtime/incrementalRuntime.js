function stableNodeSignature(node, inputValues) {
  return JSON.stringify({
    id: node.id,
    value: node.data?.value,
    refKey: node.data?.refKey,
    type: node.data?.nodeType,
    input: inputValues?.[node.id] ?? ""
  });
}

export function createRuntimeRevision(nodes = [], edges = [], inputValues = {}, previousRevision = null) {
  const nodeSignatures = new Map(nodes.map((node) => [node.id, stableNodeSignature(node, inputValues)]));
  const changedNodeIds = [];

  nodeSignatures.forEach((signature, id) => {
    if (previousRevision?.nodeSignatures?.get(id) !== signature) {
      changedNodeIds.push(id);
    }
  });

  if (previousRevision?.nodeSignatures) {
    previousRevision.nodeSignatures.forEach((_signature, id) => {
      if (!nodeSignatures.has(id)) changedNodeIds.push(id);
    });
  }

  const downstreamNodeIds = collectDownstreamNodeIds(edges, changedNodeIds);
  return {
    nodeSignatures,
    changedNodeIds,
    dirtyNodeIds: [...new Set([...changedNodeIds, ...downstreamNodeIds])]
  };
}

export function collectDownstreamNodeIds(edges = [], sourceIds = []) {
  const adjacency = edges.reduce((map, edge) => {
    if (!edge?.source || !edge?.target) return map;
    map.set(edge.source, [...(map.get(edge.source) || []), edge.target]);
    return map;
  }, new Map());

  const visited = new Set();
  const queue = [...sourceIds];
  while (queue.length) {
    const id = queue.shift();
    for (const target of adjacency.get(id) || []) {
      if (visited.has(target)) continue;
      visited.add(target);
      queue.push(target);
    }
  }
  return [...visited];
}
